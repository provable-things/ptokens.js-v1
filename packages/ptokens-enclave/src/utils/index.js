import axios from 'axios'

const API = axios.create({
  baseURL: 'https://nuc-bridge.ptokens.io',
  timeout: 50000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
    'Content-Type': 'application/json'
  }
})

/**
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 * @param {Function=} null - _callback
 */
const makeApiCall = (_callType, _apiPath, _params, _callback) =>
  new Promise((resolve, reject) =>
    API[_callType.toLowerCase()](_apiPath)
      .then(_res => _callback ? _callback(_res.data, null) : resolve(_res.data))
      .catch(_err => _callback ? _callback(null, _err) : reject(_err)
      ))

export {
  makeApiCall
}
