import abi from '../contractAbi/pEOSTokenETHContractAbi.json'
import {
  CONTRACT_ADDRESS,
  ZERO_ETHER
} from './constants'

/**
 * @param {Object} _web3
 * @param {Boolean=} false - _isWeb3Injected
 */
const _getEthAccount = (_web3, _isWeb3Injected = false) =>
  new Promise((resolve, reject) => {
    if (_isWeb3Injected) {
      _web3.eth.getAccounts()
        .then(accounts => resolve(accounts[0]))
        .catch(err => reject(err))
    } else {
      resolve(_web3.eth.defaultAccount)
    }
  })

/**
 * @param {Object} _web3
 */
const _getEthContract = (_web3, _account) => {
  const contract = new _web3.eth.Contract(abi, CONTRACT_ADDRESS, {
    defaultAccount: _account
  })
  return contract
}

/**
 * @param {Object} _web3
 */
const _getEthGasLimit = _web3 =>
  new Promise((resolve, reject) => {
    _web3.eth.getBlock('latest')
      .then(_block => resolve(_block.gasLimit))
      .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Boolean} _isWeb3Injected
 * @param {Array=} [] - _params
 */
const _makeContractCall = (_web3, _method, _isWeb3Injected, _params = []) =>
  new Promise(async (resolve, reject) => {
    const account = await _getEthAccount(_web3, _isWeb3Injected)
    const contract = _getEthContract(_web3, account)
    contract.methods[_method](..._params).call()
      .then(_res => resolve(_res))
      .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _privateKey
 * @param {Array} _params
 */
const _sendSignedBurnTx = (_web3, _privateKey, _params) =>
  _sendSignedTx(_web3, _privateKey, 'burn', _params)

/**
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
      const gasLimit = await _getEthGasLimit(_web3)

      const rawData = {
        nonce,
        gasPrice,
        gasLimit,
        to: CONTRACT_ADDRESS,
        value: ZERO_ETHER,
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

export {
  _getEthAccount,
  _getEthContract,
  _makeContractCall,
  _sendSignedBurnTx
}
