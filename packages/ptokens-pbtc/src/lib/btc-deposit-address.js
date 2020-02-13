import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import utils from 'ptokens-utils'
import {
  BTC_ESPLORA_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL
} from '../utils/constants'

class BtcDepositAddress {
  /**
   * @param {Object} _params
   */
  constructor(_params) {
    const {
      ethAddress,
      nonce,
      enclavePublicKey,
      value,
      btcNetwork,
      node,
      web3
    } = _params

    this.ethAddress = ethAddress
    this.nonce = nonce
    this.enclavePublicKey = enclavePublicKey
    this._value = value
    this._btcNetwork = btcNetwork
    this._node = node
    this._web3 = web3
  }

  toString() {
    return this._value
  }

  verify() {
    const network =
      this._btcNetwork === 'bitcoin'
        ? bitcoin.networks.bitcoin
        : bitcoin.networks.testnet

    const ethAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.ethAddress),
      'hex'
    )
    const nonceBuf = utils.converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.enclavePublicKey),
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

    return p2sh.address === this._value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (!this._value) promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await utils.btc.monitorUtxoByAddress(
        this._btcNetwork,
        this._value,
        promiEvent.eventEmitter,
        BTC_ESPLORA_POLLING_TIME
      )

      const broadcastedEthTx = await this._node.monitorIncomingTransaction(
        utxoToMonitor,
        'issue',
        promiEvent.eventEmitter
      )

      const ethTxReceipt = await utils.eth.waitForTransactionConfirmation(
        this._web3,
        broadcastedEthTx,
        ETH_NODE_POLLING_TIME_INTERVAL
      )

      promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
      promiEvent.resolve({
        to: this._ethAddress,
        tx: broadcastedEthTx
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}

export default BtcDepositAddress
