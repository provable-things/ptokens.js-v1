import abi from '../contract/pEOSToken.json'

const contractAddress = '0x4AEAFc6F72eD16665a70A45297500a0BD9d8c2F0'

/**
 *
 * @param {Object} web3
 */
const _getEthAccount = async web3 => {
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

/**
 *
 * @param {Object} web3
 */
const _getEthContract = (web3, account) => {
  const contract = new web3.eth.Contract(abi, contractAddress, {
    defaultAccount: account
  })
  return contract
}

/**
 *
 * @param {Object} web3
 * @param {String} privateKey
 * @param {String} method
 * @param {Array} params
 */
const _sendSignedTx = (web3, privateKey, method, params) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = _getEthContract(web3, web3.eth.defaultAccount)
      const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount, 'pending')
      const gasPrice = await web3.eth.getGasPrice()
      const functionAbi = contract.methods[method](...params).encodeABI()
      /* const estimatedGas = await web3.eth.estimateGas({
          to: contractAddress,
          data: functionAbi
      }) */

      const rawData = {
        nonce,
        gasPrice,
        gasLimit: 10000000,
        to: contractAddress,
        value: '0x00',
        data: functionAbi
      }
      const signedTransaction = await web3.eth.accounts.signTransaction(rawData, privateKey)
      web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        .on('receipt', r => {
          resolve(r)
        })
    } catch (e) {
      reject(e)
    }
  })

export {
  _getEthAccount,
  _getEthContract,
  _sendSignedTx
}
