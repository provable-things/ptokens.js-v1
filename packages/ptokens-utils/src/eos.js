import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import encoding from 'text-encoding'
import polling from 'light-async-polling'

const EOS_MAX_ACCOUNT_LENGTH = 12
const EOS_TRANSACTION_EXECUTED = 'executed'

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

  const signatureProvider = _signatureProvider || new JsSignatureProvider([_privateKey])

  const rpc = typeof _rpc === 'string' ? new JsonRpc(_rpc, { fetch }) : _rpc

  return new Api({
    rpc,
    signatureProvider,
    textDecoder: new encoding.TextDecoder(),
    textEncoder: new encoding.TextEncoder()
  })
}

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
  new RegExp('(([a-z]|[1-5]|.){0,12})$').test(_accountName) && _accountName.length <= EOS_MAX_ACCOUNT_LENGTH

/**
 * @param {Api} _api
 * @param {String} _tx
 */
const waitForTransactionConfirmation = async (_api, _tx, _pollingTime = 2000) => {
  let receipt = null
  await polling(async () => {
    try {
      receipt = await _api.rpc.history_get_transaction(_tx)
      if (receipt && receipt.trx.receipt.status === EOS_TRANSACTION_EXECUTED) return true
      else return false
    } catch (err) {
      return false
    }
  }, _pollingTime)
  return receipt
}

export { getApi, getAmountInEosFormat, isValidAccountName, waitForTransactionConfirmation }
