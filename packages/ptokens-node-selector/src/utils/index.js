import axios from 'axios'
import app from '../../package.json'

const NODE_CONNECTION_TIMEOUT = 5000
const DEFAULT_TIMEOUT = 10000
const BOOT_TESTNET_ENDPOINT = 'https://testnet--bootnode-eu-1.p.network'
const BOOT_MAINNET_ENDPOINT = 'https://mainnet--bootnode-eu-1.p.network'
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
 * @param {String} _network
 */
const getBootNodeApi = (_network, _appName) => {
  return _network === 'mainnet'
    ? createApi(BOOT_MAINNET_ENDPOINT, DEFAULT_TIMEOUT, _appName)
    : createApi(BOOT_TESTNET_ENDPOINT, DEFAULT_TIMEOUT, _appName)
}

/**
 * @param {Object} _api
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 * @param {Integer} _timeout
 */
const makeApiCallWithTimeout = async (
  _api,
  _callType,
  _apiPath,
  _params = [],
  _timeout = DEFAULT_TIMEOUT
) => {
  try {
    let api = null
    if (Promise.resolve(_api) === _api) api = await _api
    else api = _api

    const CancelToken = axios.CancelToken
    const options = {
      cancelToken: _timeout
        ? new CancelToken(_cancel =>
            setTimeout(
              () => _cancel(`timeout of ${_timeout}ms exceeded`),
              _timeout
            )
          )
        : undefined
    }

    const details = [
      _apiPath,
      ...(_callType === 'GET' ? [options] : [_params, options])
    ]

    const res = await api[_callType.toLowerCase()](...details)
    return res.data
  } catch (err) {
    throw new Error(err.message)
  }
}

export {
  DEFAULT_TIMEOUT,
  NODE_CONNECTION_TIMEOUT,
  createApi,
  getBootNodeApi,
  makeApiCallWithTimeout
}
