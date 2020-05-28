import polling from 'light-async-polling'

const HEX_PREFIX = '0x'

/**
 * @param {String} _string
 */
const addHexPrefix = _string =>
  isHexPrefixed(_string) ? _string : HEX_PREFIX + _string

/**
 * @param {String} _string
 */
const removeHexPrefix = _string =>
  isHexPrefixed(_string) ? _string.substr(2) : _string

/**
 *
 * @param {Number} _amount
 * @param {Number} _decimals
 * @param {String} _operation
 */
const correctFormat = (_amount, _decimals, _operation) =>
  _operation === '/'
    ? _amount / Math.pow(10, _decimals)
    : parseInt(_amount * Math.pow(10, _decimals))

/**
 * @param {Object} _web3
 * @param {Boolean=} false - _isWeb3Injected
 */
const getAccount = (_web3, _isWeb3Injected = false) =>
  new Promise((resolve, reject) => {
    if (_isWeb3Injected) {
      _web3.eth
        .getAccounts()
        .then(accounts => resolve(accounts[0]))
        .catch(err => reject(err))
    } else {
      resolve(_web3.eth.defaultAccount)
    }
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
  new Promise((resolve, reject) => {
    _web3.eth
      .getBlock('latest')
      .then(_block => resolve(_block.gasLimit))
      .catch(_err => reject(_err))
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
    const { abi, contractAddress, isWeb3Injected } = _options

    const account = await getAccount(_web3, isWeb3Injected)

    const contract = getContract(_web3, abi, contractAddress, account)
    const res = await contract.methods[_method](..._params).call()
    return res
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
const makeContractSend = (_web3, _method, _options, _params = []) =>
  new Promise((resolve, reject) => {
    _options.isWeb3Injected
      ? _makeContractSend(_web3, _method, _options, _params)
          .then(_status => resolve(_status))
          .catch(_err => reject(_err))
      : _sendSignedMethodTx(_web3, _method, _options, _params)
          .then(_receipt => resolve(_receipt))
          .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Object} _options
 * @param {Array=} [] - _params
 */
const _makeContractSend = async (_web3, _method, _options, _params = []) => {
  try {
    const { abi, contractAddress, value } = _options

    const account = await getAccount(_web3, true)

    const contract = getContract(_web3, abi, contractAddress, account)
    const res = await contract.methods[_method](..._params).send({
      from: account,
      value
    })
    return res
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * @param {Object} _web3
 * @param {Object} _options
 * @param {Array} _params
 */
const _sendSignedMethodTx = (_web3, _method, _options, _params) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        abi,
        contractAddress,
        value,
        gas,
        gasPrice,
        privateKey
      } = _options

      const contract = getContract(_web3, abi, _web3.eth.defaultAccount)
      const nonce = await _web3.eth.getTransactionCount(
        _web3.eth.defaultAccount,
        'pending'
      )

      const functionAbi = contract.methods[_method](..._params).encodeABI()

      const rawData = {
        nonce,
        gasPrice: gasPrice ? gasPrice : await _web3.eth.getGasPrice(),
        gasLimit: gas ? gas : await getGasLimit(_web3),
        to: contractAddress,
        value,
        data: functionAbi
      }

      const signedTransaction = await _web3.eth.accounts.signTransaction(
        rawData,
        privateKey
      )
      _web3.eth
        .sendSignedTransaction(signedTransaction.rawTransaction)
        .on('receipt', _receipt => {
          resolve(_receipt)
        })
        .on('error', _error => {
          reject(_error)
        })
    } catch (_err) {
      reject(_err)
    }
  })

/**
 * @param {Object} _web3
 * @param {String} _tx
 * @param {Number} _pollingTime
 */
const waitForTransactionConfirmation = async (_web3, _tx, _pollingTime) => {
  let receipt = null
  await polling(async () => {
    receipt = await _web3.eth.getTransactionReceipt(_tx)

    if (!receipt) return false
    else if (receipt.status) return true
    else return false
  }, _pollingTime)
  return receipt
}

const zeroEther = '0x00'

export {
  addHexPrefix,
  removeHexPrefix,
  correctFormat,
  getAccount,
  getContract,
  getGasLimit,
  isHexPrefixed,
  makeContractCall,
  makeContractSend,
  waitForTransactionConfirmation,
  zeroEther
}
