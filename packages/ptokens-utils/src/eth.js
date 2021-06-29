import BigNumber from 'bignumber.js'
import Web3PromiEvent from 'web3-core-promievent'
import polling from 'light-async-polling'

const HEX_PREFIX = '0x'
const zeroEther = '0x00'
const zeroAddress = '0x0000000000000000000000000000000000000000'

/**
 * @param {String} _string
 */
const addHexPrefix = _string => isHexPrefixed(_string) ? _string : HEX_PREFIX + _string

/**
 * @param {String} _string
 */
const removeHexPrefix = _string => isHexPrefixed(_string) ? _string.substr(2) : _string

/**
 *
 * @param {BigNumber} _amount
 * @param {integer} _decimals
 */

const onChainFormat = (_amount, _decimals) => _amount.multipliedBy(new BigNumber(Math.pow(10, _decimals)))

/**
 *
 * @param {BigNumber} _amount
 * @param {integer} _decimals
 */

const offChainFormat = (_amount, _decimals) => _amount.dividedBy(new BigNumber(Math.pow(10, _decimals)))

/**
 * @param {Object} _web3
 */
const getAccount = _web3 =>
  new Promise((_resolve, _reject) => {
    _web3.eth.defaultAccount
      ? _resolve(_web3.eth.defaultAccount)
      : _web3.eth
        .getAccounts()
        .then(accounts => _resolve(accounts[0]))
        .catch(err => _reject(err))
  })

/**
 * @param {Object} _web3
 * @param {Object} _abi
 * @param {String} _contractAddress
 * @param {String} _account
 */
const getContract = (_web3, _abi, _contractAddress, _account) => {
  const contract = new _web3.eth.Contract(_abi, _contractAddress, {
    defaultAccount: _account
  })
  return contract
}

/**
 * @param {Object} _web3
 */
const getGasLimit = _web3 =>
  new Promise((_resolve, _reject) => {
    _web3.eth
      .getBlock('latest')
      .then(_block => _resolve(_block.gasLimit))
      .catch(_err => _reject(_err))
  })

/**
 * @param {String} _string
 */
const isHexPrefixed = _string => _string.slice(0, 2) === HEX_PREFIX

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Object} _options
 * @param {Array=} [] - _params
 */
const makeContractCall = async (_web3, _method, _options, _params = []) => {
  try {
    const { abi, contractAddress } = _options
    const account = await getAccount(_web3)
    const contract = getContract(_web3, abi, contractAddress, account)
    return contract.methods[_method](..._params).call()
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Object} _options
 * @param {Array=} [] - _params
 */
const makeContractSend = (_web3, _method, _options, _params = []) => {
  const promiEvent = Web3PromiEvent()
  const start = async () => {
    try {
      const { abi, contractAddress, value, gasPrice, gas } = _options
      const account = await getAccount(_web3, true)
      const contract = getContract(_web3, abi, contractAddress, account)
      contract.methods[_method](..._params)
        .send({
          from: account,
          value,
          gasPrice,
          gas
        })
        .once('transactionHash', _hash => promiEvent.eventEmitter.emit('transactionHash', _hash))
        .once('receipt', _receipt => promiEvent.eventEmitter.emit('receipt', _receipt))
        .once('error', _error => promiEvent.eventEmitter.emit('error', _error))
        .then(() => promiEvent.resolve())
    } catch (_err) {
      promiEvent.reject(_err)
    }
  }

  start()
  return promiEvent.eventEmitter
}

/**
 * @param {Object} _web3
 * @param {Object} _options
 * @param {Array} _params
 */
const sendSignedMethodTx = (_web3, _method, _options, _params) => {
  const promiEvent = Web3PromiEvent()
  const start = async () => {
    try {
      const { abi, contractAddress, value, gas, gasPrice, privateKey } = _options

      const contract = getContract(_web3, abi, _web3.eth.defaultAccount)
      const nonce = await _web3.eth.getTransactionCount(_web3.eth.defaultAccount, 'pending')

      const { rawTransaction } = await _web3.eth.accounts.signTransaction(
        {
          nonce,
          gasPrice: gasPrice || await _web3.eth.getGasPrice(),
          gasLimit: gas || await getGasLimit(_web3),
          to: contractAddress,
          value,
          data: contract.methods[_method](..._params).encodeABI()
        },
        privateKey
      )

      _web3.eth
        .sendSignedTransaction(rawTransaction)
        .once('transactionHash', _hash => promiEvent.eventEmitter.emit('transactionHash', _hash))
        .once('receipt', _receipt => promiEvent.eventEmitter.emit('receipt', _receipt))
        .once('error', _error => promiEvent.eventEmitter.emit('error', _error))
        .then(() => promiEvent.resolve())
    } catch (_err) {
      promiEvent.reject(_err)
    }
  }
  start()
  return promiEvent.eventEmitter
}

/**
 * @param {Object} _web3
 * @param {String} _tx
 * @param {Number} _pollingTime
 */
const waitForTransactionConfirmation = async (_web3, _tx, _pollingTime = 5000) => {
  let receipt = null
  await polling(async () => {
    try {
      receipt = await _web3.eth.getTransactionReceipt(_tx)

      if (!receipt) return false
      else if (receipt.status) return true
      else return false
    } catch (_err) {
      return false
    }
  }, _pollingTime)
  return receipt
}

export {
  addHexPrefix,
  removeHexPrefix,
  onChainFormat,
  offChainFormat,
  getAccount,
  getContract,
  getGasLimit,
  isHexPrefixed,
  makeContractCall,
  makeContractSend,
  sendSignedMethodTx,
  waitForTransactionConfirmation,
  zeroEther,
  zeroAddress
}
