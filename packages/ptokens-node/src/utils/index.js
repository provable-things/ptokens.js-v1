import axios from 'axios'
import jsonrpc from 'jsonrpc-lite'
import { v4 as uuidv4 } from 'uuid'

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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json'
    }
  })
}

/**
 * @param {Object} _endpoint
 * @param {String} _callType
 * @param {String} _apiPath
 * @param {Object} _params
 */
const makeApiCall = async (_endpoint, _callType, _apiPath, _params = null) => {
  const { data } = await createApi(_endpoint)[_callType.toLowerCase()](
    _apiPath,
    _params
  )
  return data
}

/**
 *
 * @param {String} _endpoint
 * @param {String} _type
 * @param {String} _apiPath
 * @param {String} _call
 * @param {any} _body
 */
const makeJsonRpcSafeCall = async (
  _endpoint,
  _type,
  _apiPath,
  _call,
  _body = {}
) => {
  const uuid = uuidv4()

  const { result, id } = await makeApiCall(
    _endpoint,
    _type,
    _apiPath,
    jsonrpc.request(uuid, _call, _body)
  )

  if (uuid !== id)
    throw new Error('Returned json-rpc id does not match expected id')

  return result
}

export { createApi, makeApiCall, makeJsonRpcSafeCall, REPORT_LIMIT }
