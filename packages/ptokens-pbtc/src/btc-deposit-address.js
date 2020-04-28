import Web3PromiEvent from 'web3-core-promievent'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import * as utils from 'ptokens-utils'
import {
  BTC_ESPLORA_POLLING_TIME,
  HOST_NODE_POLLING_TIME_INTERVAL,
  BTC_DECIMALS,
  hostBlockchainEvents
} from './utils/constants'

export class BtcDepositAddress {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { hostApi, node } = _configs

    const {
      nativeBlockchain,
      nativeNetwork,
      hostNetwork,
      hostBlockchain
    } = utils.helpers.parseParams(
      _configs,
      _configs.nativeBlockchain
        ? utils.helpers.getBlockchainType[_configs.nativeBlockchain]
        : utils.helpers.blockchains.Bitcoin
    )

    this.hostBlockchain = hostBlockchain
    this.hostNetwork = hostNetwork
    this.nativeBlockchain = nativeBlockchain
    this.nativeNetwork = nativeNetwork

    this.node = node
    this.hostApi = hostApi
  }

  /**
   * @param {String} _hostAddress
   */
  async generate(_hostAddress) {
    if (
      this.hostBlockchain === utils.helpers.blockchains.Ethereum &&
      !Web3Utils.isAddress(_hostAddress)
    )
      throw new Error('Eth Address is not valid')

    if (
      this.hostBlockchain === utils.helpers.blockchains.Eosio &&
      !utils.eos.isValidAccountName(_hostAddress)
    )
      throw new Error('EOS Account is not valid')

    try {
      const deposit = await this.node.generic(
        'GET',
        `get-native-deposit-address/${_hostAddress}`
      )

      this.nonce = deposit.nonce
      this.enclavePublicKey = deposit.enclavePublicKey
      this.value = deposit.nativeDepositAddress
      this.hostAddress = _hostAddress
      return this.value
    } catch (err) {
      throw new Error('Error during deposit address generation')
    }
  }

  toString() {
    return this.value
  }

  verify() {
    const network =
      this.hostNetwork === utils.helpers.networks.BitcoinMainnet
        ? bitcoin.networks.bitcoin
        : bitcoin.networks.testnet

    const hostAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.hostAddress),
      this.hostBlockchain === utils.helpers.blockchains.Ethereum
        ? 'hex'
        : 'utf-8'
    )
    const nonceBuf = utils.converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.enclavePublicKey),
      'hex'
    )

    const hostAddressAndNonceHashBuf = bitcoin.crypto.hash256(
      Buffer.concat([hostAddressBuf, nonceBuf])
    )

    const output = bitcoin.script.compile(
      [].concat(
        hostAddressAndNonceHashBuf,
        bitcoin.opcodes.OP_DROP,
        enclavePublicKeyBuf,
        bitcoin.opcodes.OP_CHECKSIG
      )
    )

    const p2sh = bitcoin.payments.p2sh({
      redeem: {
        output,
        network
      },
      network
    })

    return p2sh.address === this.value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    if (!this.hostApi) {
      promiEvent.reject('Provider not specified. Impossible to monitor the tx')
      return
    }

    const start = async () => {
      if (!this.value) promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await utils.btc.monitorUtxoByAddress(
        this.hostNetwork,
        this.value,
        promiEvent.eventEmitter,
        BTC_ESPLORA_POLLING_TIME
      )

      const broadcastedHostTxReport = await this.node.monitorIncomingTransaction(
        utxoToMonitor,
        promiEvent.eventEmitter
      )

      const hostTxReceipt = await utils[
        this.hostBlockchain
      ].waitForTransactionConfirmation(
        this.hostApi,
        broadcastedHostTxReport.broadcast_tx_hash,
        HOST_NODE_POLLING_TIME_INTERVAL
      )

      promiEvent.eventEmitter.emit(
        hostBlockchainEvents[this.hostBlockchain],
        hostTxReceipt
      )
      promiEvent.resolve({
        to: this.hostAddress,
        tx: broadcastedHostTxReport.broadcast_tx_hash,
        amount: utils.eth.correctFormat(
          broadcastedHostTxReport.host_tx_amount,
          BTC_DECIMALS, // NOTE amount returned by the api is in sats
          '/'
        )
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}
