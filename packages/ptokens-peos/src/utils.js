import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'
import abi from './contract/pEOSToken'

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
const _getEthContract = async (web3, a) => {
  let account
  if (!a) {
    account = await _getEthAccount(web3)
  }
  const contract = new web3.eth.Contract(Abi, contractAddress, {
    defaultAccount: a ? a : account
  })
  return contract
}

/**
 * 
 * @param {Object} web3 
 * @param {String} privateKey 
 * @param {Integer} amount 
 * @param {String} eosAccount 
 */
const _sendSignedBurnTx = (web3, privateKey, amount, eosAccount) =>
  new Promise(async (resolve, reject) => {
    const contract = new web3.eth.Contract(abi, contractAddress, {
      from: web3.eth.defaultAccount ,
      gas: 3000000,
    })
    const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
    const gasPrice = await web3.eth.getGasPrice()
    const functionAbi = contract.methods.burn(amount, eosAccount).encodeABI()
    /*const estimatedGas = await .web3.eth.estimateGas({
        to: contractAddress,
        data: functionAbi
    })*/
    const rawData = {
      nonce: 136,
      gasPrice,
      gasLimit: 10000000,
      to: contractAddress,
      value: '0x00',
      data: functionAbi,
    }
    const signedTransaction = await web3.eth.accounts.signTransaction(rawData, privateKey);
    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    .on('receipt', r => {
      resolve(r)
    })
  })

/**
 *
 * @param {String} privateKey
 * @param {String} rpcAddress
 */
const _getEosJsApi = (privateKey, rpcAddress) => {
  const signatureProvider = new JsSignatureProvider([privateKey])
  const rpc = new JsonRpc(rpcAddress, { fetch })
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
  return api
}

/**
 * 
 * @param {String} account 
 */
const _isValidEosAccount = account => {
  const regex = new RegExp('([a-z]|[1-5]){12}')
  return regex.test(account)
}

/**
 * 
 * @param {Integer} ms 
 */
const sleep = ms => 
  new Promise(resolve => 
    setTimeout(resolve, ms)
  )

export {
  _getEthAccount,
  _getEthContract,
  _sendSignedBurnTx,
  _getEosJsApi,
  _isValidEosAccount,
  sleep
}
