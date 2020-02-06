import axios from 'axios'
import polling from 'light-async-polling'
import validate from 'bitcoin-address-validation'
import * as bitcoin from 'bitcoinjs-lib'

const LTC_PTOKENS_NODE_TESTNET_API =
  'http://ltcnode.ptokens.io/insight-lite-api'
const LTC_PTOKENS_NODE_MAINNET_API = 'Not available yet'

const _getInsightLiteApi = _network =>
  axios.create({
    baseURL:
      _network === 'litecoin'
        ? LTC_PTOKENS_NODE_MAINNET_API
        : LTC_PTOKENS_NODE_TESTNET_API,
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
      .catch(_err => {
        console.log(_err)
        reject(_err)
      })
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
const getUtxoByAddress = (_network, _address) =>
  _makeInsightLiteApiCall(_network, 'GET', `/addrs/${_address}/utxo`)

/**
 *
 * @param {String} _network
 * @param {String} _txId
 */
const getTransactionHexById = (_network, _txId) =>
  _makeInsightLiteApiCall(_network, 'GET', `/rawtx/${_txId}`)

/**
 * @param {String} _address
 * @param {String} _network
 */
const isValidAddress = (_network, _address) => {
  if (_network === 'testnet') {

    try {
      const decoded = bitcoin.address.fromBase58Check(_address)
      if (decoded.version === 0xc4) {
        p2sh.address = bitcoin.address.toBase58Check(decoded.hash, 0x3a)
      }
    } catch(err) {
      return false
    }
    return validate(_address) ? true : false
  } else {
    const res = _address.match(/[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}/g)
    if (!res) return false
    return res[0] === _address ? true : false
  }
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

    utxos = await _makeInsightLiteApiCall(
      _network,
      'GET',
      `/addrs/${_address}/utxo`
    )

    if (utxos.length > 0) {
      if (utxos[0].confirmations > 0) {
        if (!isBroadcasted) _eventEmitter.emit('onLtcTxBroadcasted', utxos[0])

        _eventEmitter.emit('onLtcTxConfirmed', utxos[0])
        utxo = utxos[0].txid
        return true
      } else if (!isBroadcasted) {
        isBroadcasted = true
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
  await polling(async () => {
    const transaction = await _makeInsightLiteApiCall(
      _network,
      'GET',
      `/tx/${_tx}/`
    )

    if (transaction.confirmations > 0) {
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
