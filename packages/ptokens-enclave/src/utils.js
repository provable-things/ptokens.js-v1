import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch  from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'    

/**
 * 
 * @param {Object} transfer 
 */
const eosTransact = transfer => {
  return new Promise(async(resolve, reject) => {
    try {
      const {
        eosApi
      } = _getEosJsComponents(transfer.privateKey, transfer.rpc)
      const result = await eosApi.transact({
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: transfer.actor,
            permission: transfer.permission,
          }],
          data: {
            from: transfer.from,
            to: transfer.to,
            quantity: transfer.amount + ' EOS',
            memo: transfer.memo
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 
 * @param {String} privateKey 
 * @param {String} rpcAddress 
 */
const _getEosJsComponents = (privateKey, rpcAddress) => {
  const eosSignatureProvider = new JsSignatureProvider([privateKey])
  const eosRpc = new JsonRpc(rpcAddress, { fetch })
  const eosApi = new Api({
    rpc: eosRpc,
    signatureProvider: eosSignatureProvider,
    textDecoder: new TextDecoder(), 
    textEncoder: new TextEncoder() 
  })
  return {
    eosSignatureProvider,
    eosRpc,
    eosApi
  }
}

export {
  eosTransact
}