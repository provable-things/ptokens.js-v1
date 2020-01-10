import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import encoding from 'text-encoding'

const EOS_NATIVE_TOKEN = 'eosio.token'
const EOS_NATIVE_TOKEN_DECIMALS = 4
const EOS_ACCOUNT_LENGTH = 12

/**
 * @param {String} _privateKey
 * @param {String} _rpcAddress
 * @param {String} null - _signatureProvider
 */
const getApi = (_privateKey, _rpc, _signatureProvider = null) => {
  const signatureProvider = _signatureProvider || new JsSignatureProvider([_privateKey])

  const rpc = new JsonRpc(_rpc, { fetch })
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new encoding.TextDecoder(),
    textEncoder: new encoding.TextEncoder()
  })
  return api
}

/**
 * @param {Object} _eosjs
 * @param {Array} _pubkeys
 */
const getAccountName = (_eosjs, _pubkeys) =>
  new Promise((resolve, reject) => {
    const currentPublicKey = _pubkeys[0]
    _eosjs.rpc.history_get_key_accounts(currentPublicKey)
      .then(accounts => resolve(accounts.account_names[0]))
      .catch(err => reject(err))
  })

/**
 * @param {Object} _eosjs
 */
const getAvailablePublicKeys = _eosjs =>
  new Promise((resolve, reject) => {
    _eosjs.signatureProvider.getAvailableKeys()
      .then(publicKeys => resolve(publicKeys))
      .catch(err => reject(err))
  })

/**
 * @param {String} _accountName
 */
const isValidAccountName = _accountName => {
  const regex = new RegExp('([a-z]|[1-5]){12}')
  return regex.test(_accountName) && _accountName.length === EOS_ACCOUNT_LENGTH
}

/**
 * @param {Object} _eosjs
 * @param {Object} _to
 * @param {String} _eosAccountName
 * @param {Number} _amount
 * @param {String} _memo
 * @param {String} _blocksBehind
 * @param {String} _expireSeconds
 */
const transferNativeToken = (_eosjs, _to, _accountName, _amount, _memo, _blocksBehind, _expireSeconds) =>
  new Promise((resolve, reject) => {
    _eosjs.transact({
      actions: [{
        account: EOS_NATIVE_TOKEN,
        name: 'transfer',
        authorization: [{
          actor: _accountName,
          permission: 'active'
        }],
        data: {
          from: _accountName,
          to: _to,
          quantity: _getAmountInEosFormat(_amount),
          memo: _memo
        }
      }]
    }, {
      blocksBehind: _blocksBehind,
      expireSeconds: _expireSeconds
    })
      .then(receipt => resolve(receipt))
      .catch(err => reject(err))
  })

/**
 * @param {Number} _amount
 */
const _getAmountInEosFormat = (_amount, _decimals = 4) => {
  return _amount.toFixed(EOS_NATIVE_TOKEN_DECIMALS).toString() + ' EOS'
}

export {
  getApi,
  getAccountName,
  getAvailablePublicKeys,
  isValidAccountName,
  transferNativeToken
}
