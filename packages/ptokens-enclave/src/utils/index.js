import axios from 'axios'

const REPORT_LIMIT = 100
const PEOS = 'peos'
const PEOS_ENDPOINT = 'https://nuc-bridge-1.ngrok.io/'
const PBTC = 'pbtc'
const PBTC_ENDPOINT = 'https://nuc-bridge-2.ngrok.io/'

/**
 * @param {String} _pToken
 */
const getApi = _pToken => {
  const endpoint = _getEndpoint(_pToken)
  return axios.create({
    baseURL: endpoint,
    timeout: 50000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json'
    }
  })
}

/**
 * @param {String} _pToken
 */
const _getEndpoint = _pToken => {
  switch (_pToken) {
    case PEOS: {
      return PEOS_ENDPOINT
    }
    case PBTC: {
      return PBTC_ENDPOINT
    }
    default:
      return null
  }
}

/**
 * @param {Object} _api
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 */
const makeApiCall = (_api, _callType, _apiPath, _params = null) =>
  new Promise((resolve, reject) =>
    _api[_callType.toLowerCase()](_apiPath, _params)
      .then(_res => resolve(_res.data))
      .catch(_err => reject(_err))
  )

export { getApi, makeApiCall, REPORT_LIMIT }
