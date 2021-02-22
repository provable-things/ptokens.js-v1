import axios from 'axios'
import polling from 'light-async-polling'
import { Mainnet } from './helpers/names'

const LTC_PTOKENS_NODE_TESTNET_API = 'https://ltc-testnet-node-1.ptokens.io/insight-lite-api'
const LTC_PTOKENS_NODE_MAINNET_API = 'https://ltc-node-1.ptokens.io/insight-lite-api'

const _getInsightLiteApi = _network =>
  axios.create({
    baseURL: _network === Mainnet ? LTC_PTOKENS_NODE_MAINNET_API : LTC_PTOKENS_NODE_TESTNET_API,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

const _makeInsightLiteApiCall = (_network, _callType, _apiPath, _params) =>
  new Promise((resolve, reject) => {
    _getInsightLiteApi(_network)
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
  _makeInsightLiteApiCall(_network, 'POST', '/tx/send', {
    rawtx: _tx
  })

/**
 *
 * @param {String} _network
 * @param {String} _address
 */
const getUtxoByAddress = (_network, _address) => _makeInsightLiteApiCall(_network, 'GET', `/addrs/${_address}/utxo`)

/**
 *
 * @param {String} _network
 * @param {String} _txId
 */
const getTransactionHexById = (_network, _txId) => _makeInsightLiteApiCall(_network, 'GET', `/rawtx/${_txId}`)

/**
 * @param {String} _address
 * @param {String} _network
 */
const isValidAddress = _address => {
  const res = _address.match(/(ltc1|[LM3Q2mn])[a-zA-HJ-NP-Z0-9]{26,40}/g)
  if (!res) return false
  return res[0] === _address
}

/**
 * @param {String} _address
 * @param {EventEmitter} _eventEmitter
 */
const monitorUtxoByAddress = async (
  _network,
  _address,
  _eventEmitter,
  _pollingTime,
  _broadcastEventName,
  _confirmationEventName,
  _confirmations = 1
) => {
  let isBroadcasted = false
  let utxo = null
  let utxos = []
  await polling(async () => {
    // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

    utxos = await _makeInsightLiteApiCall(_network, 'GET', `/addrs/${_address}/utxo`)

    if (utxos.length > 0) {
      if (utxos[0].confirmations > 0) {
        if (!isBroadcasted) {
          _eventEmitter.emit(_broadcastEventName, utxos[0])
          _eventEmitter.emit('onLtcTxBroadcasted', utxos[0])
          isBroadcasted = true
        }

        if (utxos[0].confirmations >= _confirmations) {
          _eventEmitter.emit(_confirmationEventName, utxos[0])
          _eventEmitter.emit('onLtcTxConfirmed', utxos[0])
          utxo = utxos[0].txid
          return true
        }
        return false
      } else if (!isBroadcasted) {
        isBroadcasted = true
        _eventEmitter.emit(_broadcastEventName, utxos[0])
        _eventEmitter.emit('onLtcTxBroadcasted', utxos[0])
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
  let transaction = null
  await polling(async () => {
    try {
      transaction = await _makeInsightLiteApiCall(_network, 'GET', `/tx/${_tx}/`)
      return transaction.confirmations > 0
    } catch (_err) {
      return false
    }
  }, _pollingTime)
  return transaction
}

export {
  broadcastTransaction,
  isValidAddress,
  getUtxoByAddress,
  getTransactionHexById,
  monitorUtxoByAddress,
  waitForTransactionConfirmation
}
