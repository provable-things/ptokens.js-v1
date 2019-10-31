import axios from 'axios'

const api = axios.create({
  baseURL: 'https://repsi.serveo.net',
  timeout: 50000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
    'Content-Type': 'application/json'
  }
})

/**
 * @param {String} _apiPath
 * @param {Function=} null - _callback
 */
const makeApiGet = (_apiPath, _callback) =>
  new Promise((resolve, reject) =>
    api.get(_apiPath)
      .then(_res => _callback ? _callback(_res, null) : resolve(_res))
      .catch(_err => _callback ? _callback(null, _err) : reject(_err)
      ))

/**
 * @param {String} _apiPath
 * @param {Object} _body
 * @param {Function=} null - _callback
 */
const makeApiPost = (_apiPath, _body, _callback) =>
  new Promise((resolve, reject) =>
    api.post(_apiPath, _body)
      .then(_res => _callback ? _callback(_res, null) : resolve(_res))
      .catch(_err => _callback ? _callback(null, _err) : reject(_err)
      ))

export {
  makeApiGet,
  makeApiPost
}
