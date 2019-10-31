import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'

/**
 * @param {String} _privateKey
 * @param {String} _rpcAddress
 */
const _getEosJsApi = (_privateKey, _rpcAddress) => {
  const signatureProvider = new JsSignatureProvider([_privateKey])
  const rpc = new JsonRpc(_rpcAddress, { fetch })
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
  return api
}

/**
 * @param {String} _account
 */
const _isValidEosAccount = _account => {
  const regex = new RegExp('([a-z]|[1-5]){12}')
  return regex.test(_account)
}

export {
  _getEosJsApi,
  _isValidEosAccount
}
