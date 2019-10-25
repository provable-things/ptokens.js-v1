import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import { Enclave } from 'ptokens-enclave'
import {
  _getEthAccount,
  _getEthContract,
  _sendSignedBurnTx,
  _getEosJsApi,
  _isValidEosAccount,
   sleep 
} from './utils'
import polling from 'light-async-polling'


const MININUM_NUMBER_OF_PEOS_MINTED = 1

class pEOS {

  constructor (options, web3 = null) {
    this.eosjs = _getEosJsApi(options.eosPrivateKey, options.eosProvider)
    this.enclave = new Enclave()
    if (web3 && web3 instanceof Web3) {
      this.isWeb3Injected = true
      this.web3 = web3
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(options.ethProvider))
      const account = this.web3.eth.accounts.privateKeyToAccount(options.ethPrivateKey)
      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = options.ethPrivateKey
    }
  }

  /**
   *
   * @param {Integer} amount
   * @param {String} ethAddress
   */
  issue (amount, ethAddress) {
    if (amount < MININUM_NUMBER_OF_PEOS_MINTED) {
      throw new Error('Amount to issue must be greater than 1 pEOS')
    }
    if (!this.web3.utils.isAddress(ethAddress)) {
      throw new Error('Eth Address is not valid')
    }

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        const pubkeys = await this.eosjs.signatureProvider.getAvailableKeys()
        const accounts = await this.eosjs.rpc.history_get_key_accounts(pubkeys[0])
        const eosAccountName = accounts.account_names[0]
        const accurateAmount = amount.toFixed(4)
        let r = await this.eosjs.transact({
          actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
              actor: eosAccountName,
              permission: 'active'
            }],
            data: {
              from: eosAccountName,
              to: 'provabletokn',
              quantity: accurateAmount + ' EOS',
              memo: ethAddress
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        promiEvent.eventEmitter.emit('onEosTxConfirmed', r)

        const polledTx = r.transaction_id
        let broadcastedTx = ''
        let isSeen = false
        await polling(async () => {
          r = await this.enclave.getIncomingTransactionStatus(polledTx)
          if (r.status !== 200) {
            promiEvent.reject('Error during the comunication with the Enclave')
            return true
          } else {
            if (r.data.broadcast === false && !isSeen) {
              promiEvent.eventEmitter.emit('onEnclaveReceivedTx', r.data)
              isSeen = true
              return false
            } else if (r.data.broadcast === true) {
              promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', r.data)
              broadcastedTx = r.data.broadcast_transaction_hash
              return true
            } else {
              return false
            }
          }
        }, 100)

        await polling(async () => {
          r = await this.web3.eth.getTransactionReceipt(broadcastedTx)
            if (r) {
              if (r.status) {
                promiEvent.eventEmitter.emit('onEthConfirmedTx', r)
                return true
              } else {
                return false
              }
            } else {
             return false
            }
        }, 3000)
        promiEvent.resolve()
      }
      start()
    } catch (err) {
      promiEvent.reject(err)
    }
    return promiEvent.eventEmitter
  }

  /**
   *
   * @param {Integer} amount
   * @param {String} eosAccount
   */
  redeem (amount, eosAccount, options) {
    if (amount === 0) {
      throw new Error('Impossible to burn 0 pEOS')
    }
    if (!_isValidEosAccount(eosAccount)){
      throw new Error('Invalid Eos account provided')
    }

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        let r = null
        if (!this.isWeb3Injected) {
          const r = await _sendSignedBurnTx(
            this.web3,
            this.ethPrivateKey,
            amount,
            eosAccount
          )
        } else {
          //TODO: injected web3
        }
        promiEvent.eventEmitter.emit('onEthTxConfirmed', r)
      }
      start()
    } catch (e) {
      promiEvent.reject(e)
    }
    return promiEvent.eventEmitter
  }
}

export {
  pEOS
}
