import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'

/**
 *
 * @param {String} privateKey
 * @param {String} rpcAddress
 */
const _getEosJsApi = (privateKey, rpcAddress) => {
  const signatureProvider = new JsSignatureProvider([privateKey])
  const rpc = new JsonRpc(rpcAddress, { fetch })
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
  return api
}

/**
 *
 * @param {String} account
 */
const _isValidEosAccount = account => {
  const regex = new RegExp('([a-z]|[1-5]){12}')
  return regex.test(account)
}

export {
  _getEosJsApi,
  _isValidEosAccount
}
