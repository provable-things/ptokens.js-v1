import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import utils from 'ptokens-utils'
import {
  LTC_NODE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL
} from '../utils/constants'

class LtcDepositAddress {
  /**
   * @param {Object} _params
   */
  constructor(_params) {
    const {
      ethAddress,
      nonce,
      enclavePublicKey,
      value,
      ltcNetwork,
      enclave,
      web3
    } = _params

    this.ethAddress = ethAddress
    this.nonce = nonce
    this.enclavePublicKey = enclavePublicKey
    this._value = value
    this._ltcNetwork = ltcNetwork
    this._enclave = enclave
    this._web3 = web3
  }

  toString() {
    return this._value
  }

  verify() {
    const network =
      this._ltcNetwork === 'litecoin'
        ? bitcoin.networks.litecoin
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

    // NOTE: make compatible litecoin testnet p2sh with bitcoinjs
    const decoded = bitcoin.address.fromBase58Check(p2sh.address)
    if (decoded.version === 0xc4)
      p2sh.address = bitcoin.address.toBase58Check(decoded.hash, 0x3a)

    return p2sh.address === this._value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (!this._value) promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await utils.ltc.monitorUtxoByAddress(
        this._ltcNetwork,
        this._value,
        promiEvent.eventEmitter,
        LTC_NODE_POLLING_TIME
      )

      const broadcastedEthTx = await this._enclave.monitorIncomingTransaction(
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

export default LtcDepositAddress
