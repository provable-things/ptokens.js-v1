import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import utils from 'ptokens-utils'

class DepositAddress {
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
      esplora,
      enclave,
      web3
    } = _params

    this.ethAddress = ethAddress
    this.nonce = nonce
    this.enclavePublicKey = enclavePublicKey
    this._value = value
    this._btcNetwork = btcNetwork
    this._esplora = esplora
    this._enclave = enclave
    this._web3 = web3
  }

  toString() {
    return this._value
  }

  verify() {
    const network = this._btcNetwork === 'bitcoin'
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

    const output = bitcoin.script.compile([].concat(
      ethAddressAndNonceHashBuf,
      bitcoin.opcodes.OP_DROP,
      enclavePublicKeyBuf,
      bitcoin.opcodes.OP_CHECKSIG
    ))

    const p2sh = bitcoin.payments.p2sh(
      {
        redeem: {
          output,
          network
        },
        network
      }
    )

    return p2sh.address === this._value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (!this._value)
        promiEvent.reject('Please provide a deposit address')

      const utxoToMonitor = await this._esplora.monitorUtxoByAddress(
        this._value,
        promiEvent.eventEmitter
      )

      const broadcastedEthTx = await this._enclave.monitorIncomingTransaction(
        utxoToMonitor,
        'issue',
        promiEvent.eventEmitter
      )

      const ethTxReceipt = await utils.eth.waitForTransactionConfirmation(
        this._web3,
        broadcastedEthTx
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

export default DepositAddress
