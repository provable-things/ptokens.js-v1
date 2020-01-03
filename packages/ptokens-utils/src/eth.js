const HEX_PREFIX = '0x'

/**
 * @param {String} _string
 */
const addHexPrefix = _string =>
  isHexPrefixed(_string)
    ? _string
    : HEX_PREFIX + _string

/**
 * @param {String} _string
 */
const removeHexPrefix = _string =>
  isHexPrefixed(_string)
    ? _string.substr(2)
    : _string

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
      _web3.eth.getAccounts()
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
    _web3.eth.getBlock('latest')
      .then(_block => resolve(_block.gasLimit))
      .catch(_err => reject(_err))
  })

/**
 * @param {String} _string
 */
const isHexPrefixed = _string =>
  _string.slice(0, 2) === HEX_PREFIX

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Object} _options
 * @param {Array=} [] - _params
 */
const makeContractCall = (_web3, _method, _options, _params = []) =>
  new Promise(async (resolve, reject) => {
    const account = await getAccount(_web3, _options.isWeb3Injected)
    const contract = getContract(
      _web3,
      _options.abi,
      _options.contractAddress,
      account
    )
    contract.methods[_method](..._params).call()
      .then(_res => resolve(_res))
      .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Object} _options
 * @param {Array=} [] - _params
 */
const makeContractSend = (_web3, _method, _options, _params = []) =>
  new Promise((resolve, reject) => {
    _options.isWeb3Injected
      ? _makeContractSend(
        _web3,
        _method,
        _options.abi,
        _options.contractAddress,
        _options.value,
        _params
      )
        .then(_status => resolve(_status))
        .catch(_err => reject(_err))
      : _sendSignedMethodTx(
        _web3,
        _options.privateKey,
        _method,
        _options.abi,
        _options.contractAddress,
        _options.value,
        _params
      )
        .then(_receipt => resolve(_receipt))
        .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _method
 * @param {Boolean} _isWeb3Injected
 * @param {Object} _abi
 * @param {String} _contractAddress
 * @param {Array=} [] - _params
 */
const _makeContractSend = (_web3, _method, _abi, _contractAddress, _value, _params = []) =>
  new Promise(async (resolve, reject) => {
    const account = await getAccount(_web3, true)
    const contract = getContract(
      _web3,
      _abi,
      _contractAddress,
      account
    )
    contract.methods[_method](..._params).send({
      from: account,
      value: _value
    })
      .then(_res => resolve(_res))
      .catch(_err => reject(_err))
  })

/**
 * @param {Object} _web3
 * @param {String} _privateKey
 * @param {String} _method
 * @param {Object} _abi
 * @param {String} _contractAddress
 * @param {Array} _params
 */
const _sendSignedMethodTx = (_web3, _privateKey, _method, _abi, _contractAddress, _value, _params) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = getContract(_web3, _abi, _web3.eth.defaultAccount)
      const nonce = await _web3.eth.getTransactionCount(_web3.eth.defaultAccount, 'pending')
      const gasPrice = await _web3.eth.getGasPrice()
      const functionAbi = contract.methods[_method](..._params).encodeABI()
      const gasLimit = await getGasLimit(_web3)

      const rawData = {
        nonce,
        gasPrice,
        gasLimit,
        to: _contractAddress,
        value: _value,
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
  addHexPrefix,
  removeHexPrefix,
  correctFormat,
  getAccount,
  getContract,
  getGasLimit,
  isHexPrefixed,
  makeContractCall,
  makeContractSend
}
