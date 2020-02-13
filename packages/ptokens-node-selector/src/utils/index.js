import axios from 'axios'

const NODE_CONNECTION_TIMEOUT = 5000
const DEFAULT_TIMEOUT = 10000
const BOOT_ENDPOINT = 'https://testnet_bootnode-eu-1.p.network/'

/**
 * @param {String} _pToken
 * @param {Number} _timeout
 */
const createApi = _endpoint => {
  return axios.create({
    baseURL: _endpoint,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json'
    }
  })
}

const getBootNodeApi = () => {
  return createApi(BOOT_ENDPOINT)
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
  NODE_CONNECTION_TIMEOUT,
  createApi,
  getBootNodeApi,
  makeApiCallWithTimeout
}
