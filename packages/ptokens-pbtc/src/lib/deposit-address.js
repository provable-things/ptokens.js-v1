import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import polling from 'light-async-polling'
import utils from 'ptokens-utils'
import {
  ESPLORA_POLLING_TIME
} from '../utils/constants'

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
      esplora
    } = _params

    this.ethAddress = ethAddress
    this.nonce = nonce
    this.enclavePublicKey = enclavePublicKey
    this._value = value
    this._btcNetwork = btcNetwork
    this._esplora = esplora
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
    const enclavePublicKeyBuf = Buffer.from(this.enclavePublicKey, 'hex')

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

      let isBroadcasted = false
      await polling(async () => {
        const txs = await this._esplora.makeApiCall(
          'GET',
          `/address/${this._value}/txs/mempool`
        )

        if (txs.length > 0) {
          isBroadcasted = true
          promiEvent.eventEmitter.emit('onBtcTxBroadcasted', txs[0].txid)
          return false
        }

        const utxos = await this._esplora.makeApiCall(
          'GET',
          `/address/${this._value}/utxo`
        )

        // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

        if (utxos.length > 0) {
          if (!isBroadcasted)
            promiEvent.eventEmitter.emit('onBtcTxBroadcasted', utxos[0].txid)

          promiEvent.eventEmitter.emit('onBtcTxConfirmed', utxos[0].txid)
          return true
        } else {
          return false
        }
      }, ESPLORA_POLLING_TIME)

      // TODO: check the enclave issuing status

      promiEvent.resolve() // TODO: choose params to return
    }

    start()
    return promiEvent.eventEmitter
  }
}

export default DepositAddress
