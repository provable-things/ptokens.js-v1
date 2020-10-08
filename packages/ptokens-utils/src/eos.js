import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import encoding from 'text-encoding'
import polling from 'light-async-polling'

const EOS_MAX_ACCOUNT_LENGTH = 12
const EOS_TRANSACTION_EXECUTED = 'executed'
const EOS_NODE_POLLING_TIME_INTERVAL = 300

/**
 * @param {String} _privateKey
 * @param {JsonRpc | String} _rpc
 * @param {JsSignatureProvider} null - _signatureProvider
 */
const getApi = (_privateKey, _rpc, _signatureProvider = null) => {
  if (_rpc && !_privateKey && !_signatureProvider) {
    const rpc = typeof _rpc === 'string' ? new JsonRpc(_rpc, { fetch }) : _rpc

    return new Api({
      rpc,
      textDecoder: new encoding.TextDecoder(),
      textEncoder: new encoding.TextEncoder()
    })
  }

  const signatureProvider =
    _signatureProvider || new JsSignatureProvider([_privateKey])

  const rpc = typeof _rpc === 'string' ? new JsonRpc(_rpc, { fetch }) : _rpc

  return new Api({
    rpc,
    signatureProvider,
    textDecoder: new encoding.TextDecoder(),
    textEncoder: new encoding.TextEncoder()
  })
}

/**
 * @param {JsonRpc} _rpc
 * @param {Array} _pubkeys
 */
const getAccountName = (_rpc, _pubkeys) =>
  new Promise((resolve, reject) => {
    const currentPublicKey = _pubkeys[0]
    _rpc
      .history_get_key_accounts(currentPublicKey)
      .then(accounts => resolve(accounts.account_names[0]))
      .catch(err => reject(err))
  })

/**
 * @param {Number} _amount
 */
const getAmountInEosFormat = (_amount, _decimals = 4, symbol) => {
  return `${parseFloat(_amount).toFixed(_decimals)} ${symbol}`
}

/**
 * @param {String} _accountName
 */
const isValidAccountName = _accountName =>
  // prettier-ignore
  (new RegExp('(([a-z]|[1-5]|.){0,12})$')).test(_accountName) && _accountName.length <= EOS_MAX_ACCOUNT_LENGTH

/**
 * @param {Api} _api
 * @param {String} _tx
 */
const waitForTransactionConfirmation = async (_api, _tx) => {
  let receipt = null
  await polling(async () => {
    try {
      receipt = await _api.rpc.history_get_transaction(_tx)

      if (receipt && receipt.trx.receipt.status === EOS_TRANSACTION_EXECUTED)
        return true
      else return false
    } catch (err) {
      return false
    }
  }, EOS_NODE_POLLING_TIME_INTERVAL)
  return receipt
}

export {
  getApi,
  getAccountName,
  getAmountInEosFormat,
  isValidAccountName,
  waitForTransactionConfirmation
}
