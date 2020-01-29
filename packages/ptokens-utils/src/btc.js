import validate from 'bitcoin-address-validation'
import axios from 'axios'
import polling from 'light-async-polling'

const BLOCKSTREAM_BASE_TESTNET_ENDPOINT =
  'https://blockstream.info/testnet/api/'
const BLOCKSTREAM_BASE_MAINNET_ENDPOINT = 'https://blockstream.info/api/'

const _getEsploraApi = _network =>
  axios.create({
    baseURL:
      _network === 'bitcoin'
        ? BLOCKSTREAM_BASE_MAINNET_ENDPOINT
        : BLOCKSTREAM_BASE_TESTNET_ENDPOINT,
    timeout: 50000,
    headers: {
      'Content-Type': 'text/plain'
    }
  })

const _makeEsploraApiCall = (_network, _callType, _apiPath, _params) =>
  new Promise((resolve, reject) => {
    _getEsploraApi(_network)
      [_callType.toLowerCase()](_apiPath, _params)
      .then(_res => resolve(_res.data))
      .catch(_err => reject(_err))
  })

/**
 *
 * @param {String} _network
 * @param {String} _tx
 */
const broadcastTransaction = (_network, _tx) =>
  _makeEsploraApiCall(_network, 'POST', '/tx', _tx)

/**
 *
 * @param {String} _network
 * @param {String} _address
 */
const getUtxoByAddress = (_network, _address) =>
  _makeEsploraApiCall(_network, 'GET', `/address/${_address}/utxo`)

/**
 *
 * @param {String} _network
 * @param {String} _txId
 */
const getTransactionHexById = (_network, _txId) =>
  _makeEsploraApiCall(_network, 'GET', `/tx/${_txId}/hex`)

/**
 * @param {String} _address
 * @param {String} _network
 */
const isValidAddress = _address => {
  return validate(_address)
}

/**
 * @param {String} _address
 * @param {EventEmitter} _eventEmitter
 */
const monitorUtxoByAddress = async (
  _network,
  _address,
  _eventEmitter,
  _pollingTime
) => {
  let isBroadcasted = false
  let utxo = null
  let utxos = []
  await polling(async () => {
    // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

    utxos = await _makeEsploraApiCall(
      _network,
      'GET',
      `/address/${_address}/utxo`
    )

    if (utxos.length > 0) {
      if (utxos[0].status.confirmed) {
        if (!isBroadcasted) _eventEmitter.emit('onBtcTxBroadcasted', utxos[0])

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
  }, _pollingTime)
  return utxo
}

/**
 * @param {String} _network
 * @param {String} _tx
 * @param {Number} _pollingTime
 */
const waitForTransactionConfirmation = async (_network, _tx, _pollingTime) => {
  await polling(async () => {
    const status = await _makeEsploraApiCall(
      _network,
      'GET',
      `/tx/${_tx}/status`
    )

    if (status.confirmed) {
      return true
    } else {
      return false
    }
  }, _pollingTime)
  return true
}

export {
  broadcastTransaction,
  isValidAddress,
  getUtxoByAddress,
  getTransactionHexById,
  monitorUtxoByAddress,
  waitForTransactionConfirmation
}
