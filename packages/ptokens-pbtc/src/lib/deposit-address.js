import Web3PromiEvent from 'web3-core-promievent'
import * as bitcoin from 'bitcoinjs-lib'
import polling from 'light-async-polling'
import utils from 'ptokens-utils'
import {
  ESPLORA_POLLING_TIME,
  ENCLAVE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL
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

      let isBroadcasted = false
      let utxoToMonitor = null
      let utxos = []
      await polling(async () => {
        // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

        utxos = await this._esplora.makeApiCall(
          'GET',
          `/address/${this._value}/utxo`
        )

        if (utxos.length > 0) {
          if (utxos[0].status.confirmed) {
            if (!isBroadcasted)
              promiEvent.eventEmitter.emit('onBtcTxBroadcasted', utxos[0])

            promiEvent.eventEmitter.emit('onBtcTxConfirmed', utxos[0])
            utxoToMonitor = utxos[0].txid
            return true
          } else if (!isBroadcasted) {
            isBroadcasted = true
            promiEvent.eventEmitter.emit('onBtcTxBroadcasted', utxos[0])
            return false
          }
        } else {
          return false
        }
      }, ESPLORA_POLLING_TIME)

      const broadcastedEthTx = await this._enclave.monitorIncomingTransaction(
        utxoToMonitor,
        'issue',
        promiEvent.eventEmitter
      )

      console.log(broadcastedEthTx)

      await polling(async () => {
        const ethTxReceipt = await this._web3.eth.getTransactionReceipt(broadcastedEthTx)

        if (!ethTxReceipt) {
          return false
        } else if (ethTxReceipt.status) {
          promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
          return true
        } else {
          return false
        }
      }, ETH_NODE_POLLING_TIME_INTERVAL)

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
