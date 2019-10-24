import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'
import { eosTransact } from './utils'

class pEOS {
  /**
   *
   * @param {Object} options
   * @param {Object} web3
   */
  constructor (options, web3 = null) {
    this.eosPrivateKey = options.eosPrivateKey
    this.eosRpc = options.eosRpc
    this.eosAccountName = options.eosAccountName
    this.ethPrivateKey = options.ethPrivateKey
    this.ethRpc = options.ethRpc
    this.web3 = web3
  }

  /**
   *
   * @param {Float} amount
   * @param {String} ethAddress
   */
  issue (amount, ethAddress, permission = 'active') {
    new Promise(async (resolve, reject) => {
      try {
        const accurateAmount = amount.toFixed(4)
        const result = await eosTransact({
          privateKey: this.eosPrivateKey,
          rpc: this.eosRpc,
          from: this.eosAccountName,
          to: 'provabletokn',
          amount: accurateAmount,
          memo: ethAddress,
          permission,
          actor: this.eosAccountName
        })
        console.log(result)
      } catch (err) {
        console.log(err)
      }
    })
  }

  /**
   *
   * @param {Float} amount
   * @param {String} eosAccount
   */
  redeem (amount, eosAccount) {
    // TODO
  }
}

export {
  pEOS
}

/* const issue = (amount, ethAddress, ) => {
  const promiEvent = Web3PromiEvent()

  /*setTimeout(function() {
      promiEvent.eventEmitter.emit('done', 'Hello!')
      promiEvent.resolve('Hello!')
  }, 10)
  const result = await eos.transact({
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: account.name,
        permission: account.authority,
      }],
      data: {
        from: account.name,
        to: 'provabletokn',
        quantity: amount + ' EOS',
        memo
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  })

  return promiEvent.eventEmitter
} */
