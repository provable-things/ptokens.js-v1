import axios from 'axios'

const REPORT_LIMIT = 100

/**
 * @param {String} _pToken
 * @param {Number} _timeout
 */
const createApi = (_endpoint, _timeout = 50000) => {
  return axios.create({
    baseURL: _endpoint,
    timeout: _timeout,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json'
    }
  })
}

/**
 * @param {Object} _api
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 */
const makeApiCall = async (_api, _callType, _apiPath, _params = null) => {
  try {
    let api = null
    if (Promise.resolve(_api) === _api) api = await _api
    else api = _api

    const res = await api[_callType.toLowerCase()](_apiPath, _params)
    return res.data
  } catch (err) {
    throw new Error(err.message)
  }
}

export { createApi, makeApiCall, REPORT_LIMIT }
