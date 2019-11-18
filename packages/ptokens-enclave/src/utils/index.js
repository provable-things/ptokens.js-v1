import axios from 'axios'

const API = axios.create({
  baseURL: 'https://nuc-bridge-1.ngrok.io/',
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
 */
const makeApiCall = (_callType, _apiPath, _params) =>
  new Promise((resolve, reject) =>
    API[_callType.toLowerCase()](_apiPath)
      .then(_res => resolve(_res.data))
      .catch(_err => reject(_err)))

export {
  makeApiCall
}
