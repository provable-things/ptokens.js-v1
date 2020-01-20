import axios from 'axios'
import polling from 'light-async-polling'
import { ESPLORA_POLLING_TIME } from '../utils/constants'

const BLOCKSTREAM_BASE_TESTNET_ENDPOINT = 'https://blockstream.info/testnet/api/'
const BLOCKSTREAM_BASE_MAINNET_ENDPOINT = 'https://blockstream.info/api/'

class Esplora {
  /**
   * @param {String} _network
   */
  constructor(_network) {
    const endpoint = _network === 'bitcoin'
      ? BLOCKSTREAM_BASE_MAINNET_ENDPOINT
      : BLOCKSTREAM_BASE_TESTNET_ENDPOINT

    this.api = axios.create({
      baseURL: endpoint,
      timeout: 50000,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }

  /**
   * @param {String} _callType
   * @param {String} _apiPath
   * @param {Object} _params
   */
  makeApiCall(_callType, _apiPath, _params = null) {
    return new Promise((resolve, reject) =>
      this.api[_callType.toLowerCase()](_apiPath, _params)
        .then(_res => resolve(_res.data))
        .catch(_err => reject(_err)))
  }

  /**
   * @param {String} _address
   * @param {EventEmitter} _eventEmitter
   */
  async monitorUtxoByAddress(_address, _eventEmitter) {
    let isBroadcasted = false
    let utxo = null
    let utxos = []
    await polling(async () => {
      // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

      utxos = await this.makeApiCall(
        'GET',
        `/address/${_address}/utxo`
      )

      if (utxos.length > 0) {
        if (utxos[0].status.confirmed) {
          if (!isBroadcasted)
            _eventEmitter.emit('onBtcTxBroadcasted', utxos[0])

          _eventEmitter.emit('onBtcTxConfirmed', utxos[0])
          utxo = utxos[0].txid
          return true
        } else if (!isBroadcasted) {
          isBroadcasted = true
          _eventEmitter.emit('onBtcTxBroadcasted', utxos[0])
          return false
        }
      } else {
        return false
      }
    }, ESPLORA_POLLING_TIME)
    return utxo
  }

  monitorTransactionConfirmation(_tx, _eventEmitter) {
    return polling(async () => {
      const status = await this.makeApiCall(
        'GET',
        `/tx/${_tx}/status`
      )

      if (status.confirmed) {
        _eventEmitter.emit('onBtcTxConfirmed', _tx)
        return true
      } else {
        return false
      }
    }, ESPLORA_POLLING_TIME)
  }
}

export default Esplora
