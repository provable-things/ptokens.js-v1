import axios from 'axios'
import app from '../../package.json'

const REPORT_LIMIT = 100
const DEFAULT_TIMEOUT = 5000
const DEFAULT_USER_AGENT = `ptokens.js/${app.version}`

/**
 * @param {String} _pToken
 * @param {Number} _timeout
 * @param {String} _appName
 */
const createApi = (_endpoint, _timeout = DEFAULT_TIMEOUT, _appName) => {
  return axios.create({
    baseURL: _endpoint,
    timeout: _timeout,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json',
      'User-Agent': _appName
        ? `${DEFAULT_USER_AGENT} ${_appName}`
        : DEFAULT_USER_AGENT
    }
  })
}

/**
 * @param {Object} _endpoint
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 */
const makeApiCall = async (
  _endpoint,
  _callType,
  _apiPath,
  _params = null,
  _appName
) => {
  try {
    const { data } = await createApi(_endpoint, DEFAULT_TIMEOUT, _appName)[
      _callType.toLowerCase()
    ](_apiPath, _params)
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export { createApi, makeApiCall, REPORT_LIMIT }
