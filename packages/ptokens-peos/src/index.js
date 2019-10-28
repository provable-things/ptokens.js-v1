import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import { Enclave } from 'ptokens-enclave'
import {
  _getEthAccount,
  _getEthContract,
  _sendSignedTx
} from './utils/eth'
import {
  _getEosJsApi,
  _isValidEosAccount
} from './utils/eos'
import polling from 'light-async-polling'

const MININUM_NUMBER_OF_PEOS_MINTED = 1
const TOKEN_DECIMALS = 4

class pEOS {
  constructor (options, web3 = null) {
    this.eosjs = _getEosJsApi(options.eosPrivateKey, options.eosProvider)
    this.enclave = new Enclave()
    if (web3 && web3 instanceof Web3) {
      this.isWeb3Injected = true
      this.web3 = web3
    } else {
      this.web3 = new Web3(options.ethProvider)
      const account = this.web3.eth.accounts.privateKeyToAccount(options.ethPrivateKey)
      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = options.ethPrivateKey
    }
  }

  /**
   *
   * @param {Integer} amount
   * @param {String} ethAddress
   * @param {Function=} null - cb
   */
  issue (amount, ethAddress, cb) {
    if (amount < MININUM_NUMBER_OF_PEOS_MINTED)
      throw new Error('Amount to issue must be greater than 1 pEOS')

    if (!this.web3.utils.isAddress(ethAddress))
      throw new Error('Eth Address is not valid')

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
              // NOTE: could happen that eos tx is confirmed before enclave received it
              if (!isSeen)
                promiEvent.eventEmitter.emit('onEnclaveReceivedTx', r.data)

              promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', r.data)
              broadcastedTx = r.data.broadcast_transaction_hash
              return true
            } else {
              return false
            }
          }
        }, 200)

        await polling(async () => {
          r = await this.web3.eth.getTransactionReceipt(broadcastedTx)
          if (r) {
            if (r.status) {
              promiEvent.eventEmitter.emit('onEthTxConfirmed', r)

              return true
            } else {
              return false
            }
          } else {
            return false
          }
        }, 3000)

        const result = {
          totalIssued: amount.toFixed(TOKEN_DECIMALS),
          to: ethAddress
        }
        cb ? cb(result, null) : promiEvent.resolve(result)
      }
      start()
    } catch (e) {
      cb ? cb(null, e) : promiEvent.reject(e)
    }
    return promiEvent.eventEmitter
  }

  /**
   *
   * @param {Integer} amount
   * @param {String} eosAccount
   * @param {Function=} null - cb
   */
  redeem (amount, eosAccount, cb) {
    if (amount === 0)
      throw new Error('Impossible to burn 0 pEOS')

    if (!_isValidEosAccount(eosAccount))
      throw new Error('Invalid Eos account provided')

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        let r = null
        const accurateAmount = amount * Math.pow(10, TOKEN_DECIMALS)
        if (!this.isWeb3Injected) {
          r = await _sendSignedTx(
            this.web3,
            this.ethPrivateKey,
            'burn',
            [
              accurateAmount,
              eosAccount
            ]
          )
        } else {
          const account = await _getEthAccount(this.web3)
          const contract = _getEthContract(this.web3, account)
          r = await contract.methods.burn(amount, eosAccount).send({
            from: account
          })
        }
        promiEvent.eventEmitter.emit('onEthTxConfirmed', r)

        const polledTx = r.transactionHash
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
              if (!isSeen)
                promiEvent.eventEmitter.emit('onEnclaveReceivedTx', r.data)

              promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', r.data)
              broadcastedTx = r.data.broadcast_transaction_hash
              return true
            } else {
              return false
            }
          }
        }, 100)

        await polling(async () => {
          r = await this.eosjs.rpc.history_get_transaction(broadcastedTx)
          if (r.trx.receipt.status === 'executed') {
            promiEvent.eventEmitter.emit('onEosTxConfirmed', r.data)
            return true
          } else {
            return false
          }
        }, 300)

        const result = {
          totalRedeemed: amount.toFixed(TOKEN_DECIMALS),
          to: eosAccount
        }
        cb ? cb(result, null) : promiEvent.resolve(result)
      }
      start()
    } catch (e) {
      cb ? cb(null, e) : promiEvent.reject(e)
    }
    return promiEvent.eventEmitter
  }

  /**
   *
   * @param {Function=} null - cb
   */
  getTotalIssued (cb = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let account = null
        if (this.isWeb3Injected)
          account = await _getEthAccount(this.web3)
        else
          account = this.web3.eth.defaultAccount

        const contract = _getEthContract(this.web3, account)
        const totalMinted = await contract.methods.totalMinted().call()
        const totalIssued = totalMinted / Math.pow(10, TOKEN_DECIMALS)
        cb ? cb(totalIssued, null) : resolve(totalIssued)
      } catch (e) {
        cb ? cb(null, e) : reject(e)
      }
    })
  }

  /**
   *
   * @param {Function=} null - cb
   */
  getTotalRedeemed (cb = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let account = null
        if (this.isWeb3Injected)
          account = await _getEthAccount(this.web3)
        else
          account = this.web3.eth.defaultAccount

        const contract = _getEthContract(this.web3, account)
        const totalBurned = await contract.methods.totalBurned().call()
        const totalRedeemed = totalBurned / Math.pow(10, TOKEN_DECIMALS)
        cb ? cb(totalRedeemed, null) : resolve(totalRedeemed)
      } catch (e) {
        cb ? cb(null, e) : reject(e)
      }
    })
  }
}

export {
  pEOS
}
