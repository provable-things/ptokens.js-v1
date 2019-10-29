import abi from '../contract/pEOSToken.json'
import {
  CONTRACT_ADDRESS,
  TOKEN_DECIMALS
} from './constants'

/**
 *
 * @param {Object} _web3
 */
const _getEthAccount = async _web3 => {
  const accounts = await _web3.eth.getAccounts()
  return accounts[0]
}

/**
 *
 * @param {Object} _web3
 */
const _getEthContract = (_web3, _account) => {
  const contract = new _web3.eth.Contract(abi, CONTRACT_ADDRESS, {
    defaultAccount: _account
  })
  return contract
}

/**
 *
 * @param {Object} _web3
 * @param {String} _privateKey
 * @param {String} _method
 * @param {Array} _params
 */
const _sendSignedTx = (_web3, _privateKey, _method, _params) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = _getEthContract(_web3, _web3.eth.defaultAccount)
      const nonce = await _web3.eth.getTransactionCount(_web3.eth.defaultAccount, 'pending')
      const gasPrice = await _web3.eth.getGasPrice()
      const functionAbi = contract.methods[_method](..._params).encodeABI()
      /* const estimatedGas = await web3.eth.estimateGas({
          to: CONTRACT_ADDRESS,
          data: functionAbi
      }) */

      const rawData = {
        nonce,
        gasPrice,
        gasLimit: 10000000,
        to: CONTRACT_ADDRESS,
        value: '0x00',
        data: functionAbi
      }
      const signedTransaction = await _web3.eth.accounts.signTransaction(rawData, _privateKey)
      _web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        .on('receipt', _receipt => {
          resolve(_receipt)
        })
    } catch (_err) {
      reject(_err)
    }
  })

/**
 *
 * @param {Object} _web3
 * @param {String} _method
 * @param {Boolean} _isWeb3Injected
 * @param {Function=} null - _callback
 */
const _getTotalOf = (_web3, _method, _isWeb3Injected, _callback) =>
  new Promise(async (resolve, reject) => {
    const account = _isWeb3Injected
      ? await _getEthAccount(_web3)
      : _web3.eth.defaultAccount

    const contract = _getEthContract(_web3, account)
    contract.methods[_method]().call()
      .then(_total => {
        const accurateTotal = _total / Math.pow(10, TOKEN_DECIMALS)
        _callback ? _callback(accurateTotal, null) : resolve(accurateTotal)
      })
      .catch(_err => _callback ? _callback(null, _err) : reject(_err))
  })

export {
  _getEthAccount,
  _getEthContract,
  _sendSignedTx,
  _getTotalOf
}
