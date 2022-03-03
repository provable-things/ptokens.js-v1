import axios from 'axios'
import polling from 'light-async-polling'
import { Testnet } from './helpers/names'

const DOGE_CHAIN_API = 'https://dogechain.info/api/v1'

const _getDogeChainApi = _network => {
  if (_network === Testnet) throw new Error('Dogecoin on Testnet is not supported')
  return axios.create({
    baseURL: DOGE_CHAIN_API,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const _makeDogeChainApiCall = (_network, _callType, _apiPath, _params) =>
  new Promise((resolve, reject) => {
    _getDogeChainApi(_network)
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
  _makeDogeChainApiCall(_network, 'POST', '/pushtx', {
    tx: _tx
  })

/**
 *
 * @param {String} _network
 * @param {String} _address
 */
const getUtxoByAddress = (_network, _address) =>
  new Promise((_resolve, _reject) =>
    _makeDogeChainApiCall(_network, 'GET', `/unspent/${_address}/`)
      .then(({ unspent_outputs, success, error }) => success ? _resolve(unspent_outputs) : _reject(error))
      .catch(_reject)
  )

/**
 * @param {String} _address
 * @param {String} _network
 */
const isValidAddress = _address => {
  const res = _address.match(/D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}/g)
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
  await polling(async () => {
    const utxos = await getUtxoByAddress(_network, _address)
    if (utxos.length > 0) {
      if (utxos[0].confirmations > 0) {
        if (!isBroadcasted) {
          _eventEmitter.emit(_broadcastEventName, utxos[0])
          isBroadcasted = true
        }

        if (utxos[0].confirmations >= _confirmations) {
          _eventEmitter.emit(_confirmationEventName, utxos[0])
          utxo = utxos[0].tx_hash
          return true
        }
        return false
      } else if (!isBroadcasted) {
        isBroadcasted = true
        _eventEmitter.emit(_broadcastEventName, utxos[0])
        return false
      }
    } else {
      return false
    }
  }, _pollingTime)
  return utxo.startsWith('0x') ? utxo : '0x' + utxo
}

/**
 * @param {String} _network
 * @param {String} _transactionHash
 * @param {Number} _pollingTime
 */
const waitForTransactionConfirmation = async (_network, _transactionHash, _pollingTime) => {
  let transactionToReturn = null
  await polling(async () => {
    try {
      const { transaction } = await _makeDogeChainApiCall(_network, 'GET', `/transaction/${_transactionHash}/`)
      transactionToReturn = transaction
      return transaction.confirmations > 0
    } catch (_err) {
      return false
    }
  }, _pollingTime)
  return transactionToReturn
}

export { broadcastTransaction, isValidAddress, getUtxoByAddress, monitorUtxoByAddress, waitForTransactionConfirmation }
