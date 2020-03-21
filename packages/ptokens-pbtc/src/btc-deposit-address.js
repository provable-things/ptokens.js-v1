import Web3PromiEvent from 'web3-core-promievent'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import * as utils from 'ptokens-utils'
import {
  BTC_ESPLORA_POLLING_TIME,
  HOST_NODE_POLLING_TIME_INTERVAL,
  hostBlockchainEvents
} from './utils/constants'

export class BtcDepositAddress {
  /**
   * @param {Object} _params
   */
  constructor(_params) {
    const {
      network,
      node,
      hostProvider,
      hostTokenDecimals,
      hostBlockchain
    } = _params

    if (!hostBlockchain)
      throw new Error('Bad Initialization. hostBlockchain is nedeed')

    this.hostBlockchain = hostBlockchain.toLowerCase()
    if (this.hostBlockchain !== 'eth' && this.hostBlockchain !== 'eos')
      throw new Error(
        'Bad Initialization. Please provide a valid hostBlockchain value'
      )

    this.network = network
    this.node = node
    this.hostProvider = hostProvider
    this.hostBlockchain = hostBlockchain.toLowerCase()

    this.hostBlockchain === 'eth'
      ? (this.hostTokenDecimals = hostTokenDecimals || 18)
      : (this.hostTokenDecimals = hostTokenDecimals || 8)
  }

  /**
   * @param {String} _hostAddress
   */
  async generate(_hostAddress) {
    if (this.hostBlockchain === 'eth' && !Web3Utils.isAddress(_hostAddress))
      throw new Error('Eth Address is not valid')

    if (
      this.hostBlockchain === 'eos' &&
      !utils.eos.isValidAccountName(_hostAddress)
    )
      throw new Error('EOS Address is not valid')

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
      this.network === 'bitcoin'
        ? bitcoin.networks.bitcoin
        : bitcoin.networks.testnet

    const hostAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.hostAddress),
      this.hostBlockchain === 'eth' ? 'hex' : 'utf-8'
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

    if (!this.hostProvider) {
      promiEvent.reject('Provider not specified. Impossible to monitor the tx')
      return
    }

    const start = async () => {
      if (!this.value) promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await utils.btc.monitorUtxoByAddress(
        this.network,
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
        this.hostProvider,
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
        amount:
          //NOTE: provisional check because of different amounts format
          this.hostBlockchain === 'eth'
            ? utils.eth.correctFormat(
                broadcastedHostTxReport.host_tx_amount,
                this.hostTokenDecimals,
                '/'
              )
            : broadcastedHostTxReport.host_tx_amount
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}
