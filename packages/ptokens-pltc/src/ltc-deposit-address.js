import Web3PromiEvent from 'web3-core-promievent'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import { ltc, eth, converters } from 'ptokens-utils'
import {
  LTC_NODE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL
} from './utils/constants'

export class LtcDepositAddress {
  /**
   * @param {Object} _params
   */
  constructor(_params) {
    const { network, node, web3 } = _params

    this.network = network
    this.node = node
    this._web3 = web3
  }

  /**
   * @param {String} _ethAddress
   */
  async generate(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    try {
      const deposit = await this.node.generic(
        'GET',
        `get-native-deposit-address/${this.network}/${_ethAddress}`
      )

      ;(this.nonce = deposit.nonce),
        (this.enclavePublicKey = deposit.enclavePublicKey)
      this.value = deposit.nativeDepositAddress
      this.ethAddress = _ethAddress
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
      this.network === 'litecoin'
        ? bitcoin.networks.litecoin
        : bitcoin.networks.testnet

    const ethAddressBuf = Buffer.from(
      eth.removeHexPrefix(this.ethAddress),
      'hex'
    )
    const nonceBuf = converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(
      eth.removeHexPrefix(this.enclavePublicKey),
      'hex'
    )

    const ethAddressAndNonceHashBuf = bitcoin.crypto.hash256(
      Buffer.concat([ethAddressBuf, nonceBuf])
    )

    const output = bitcoin.script.compile(
      [].concat(
        ethAddressAndNonceHashBuf,
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

    // NOTE: make compatible litecoin testnet p2sh with bitcoinjs
    const decoded = bitcoin.address.fromBase58Check(p2sh.address)
    if (decoded.version === 0xc4)
      p2sh.address = bitcoin.address.toBase58Check(decoded.hash, 0x3a)

    return p2sh.address === this.value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (!this.value) promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await ltc.monitorUtxoByAddress(
        this.network,
        this.value,
        promiEvent.eventEmitter,
        LTC_NODE_POLLING_TIME
      )

      const broadcastedEthTxReport = await this.node.monitorIncomingTransaction(
        utxoToMonitor,
        promiEvent.eventEmitter
      )

      const ethTxReceipt = await eth.waitForTransactionConfirmation(
        this._web3,
        broadcastedEthTxReport.host_tx_hash,
        ETH_NODE_POLLING_TIME_INTERVAL
      )

      promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
      promiEvent.resolve({
        to: this._ethAddress,
        tx: broadcastedEthTxReport.host_tx_hash
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}
