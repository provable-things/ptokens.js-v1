import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import encoding from 'text-encoding'
import {
  EOS_BLOCKS_BEHIND,
  EOS_EXPIRE_SECONDS,
  EOS_NATIVE_TOKEN,
  TOKEN_DECIMALS
} from './constants'

/**
 * @param {Object} _eosjs
 * @param {String} _eosAccountName
 * @param {Number} _amount
 * @param {String} _memo
 */
const _eosTransactToProvabletokn = (_eosjs, _eosAccountName, _amount, _memo) =>
  new Promise((resolve, reject) => {
    _eosjs.transact({
      actions: [{
        account: EOS_NATIVE_TOKEN,
        name: 'transfer',
        authorization: [{
          actor: _eosAccountName,
          permission: 'active'
        }],
        data: {
          from: _eosAccountName,
          to: 'provabletokn',
          quantity: _getAmountInEosFormat(_amount),
          memo: _memo
        }
      }]
    }, {
      blocksBehind: EOS_BLOCKS_BEHIND,
      expireSeconds: EOS_EXPIRE_SECONDS
    })
      .then(eosTxReceipt => resolve(eosTxReceipt))
      .catch(err => reject(err))
  })

/**
 * @param {Number} _amount
 */
const _getAmountInEosFormat = _amount => {
  return _amount.toFixed(TOKEN_DECIMALS).toString() + ' EOS'
}

/**
 * @param {Object} _eosjs
 */
const _getEosAvailablePublicKeys = _eosjs =>
  new Promise((resolve, reject) => {
    _eosjs.signatureProvider.getAvailableKeys()
      .then(publicKeys => resolve(publicKeys))
      .catch(err => reject(err))
  })

/**
 * @param {Object} _eosjs
 * @param {Array} _pubkeys
 */
const _getEosAccountName = (_eosjs, _pubkeys) =>
  new Promise((resolve, reject) => {
    const currentPublicKey = _pubkeys[0]
    _eosjs.rpc.history_get_key_accounts(currentPublicKey)
      .then(accounts => resolve(accounts.account_names[0]))
      .catch(err => reject(err))
  })

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
    textDecoder: new encoding.TextDecoder(),
    textEncoder: new encoding.TextEncoder()
  })
  return api
}

/**
 * @param {String} _accountName
 */
const _isValidEosAccountName = _accountName => {
  const regex = new RegExp('([a-z]|[1-5]){12}')
  return regex.test(_accountName)
}

export {
  _eosTransactToProvabletokn,
  _getAmountInEosFormat,
  _getEosAvailablePublicKeys,
  _getEosAccountName,
  _getEosJsApi,
  _isValidEosAccountName

}
