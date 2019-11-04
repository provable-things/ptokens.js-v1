import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import Enclave from 'ptokens-enclave'
import {
  _getEthAccount,
  _getEthContract,
  _sendSignedTx,
  _getTotalOf
} from './utils/eth'
import {
  _getEosJsApi,
  _isValidEosAccount
} from './utils/eos'
import {
  TOKEN_DECIMALS,
  ETH_NODE_POLLING_TIME_INTERVAL,
  ENCLAVE_POLLING_TIME,
  EOS_NODE_POLLING_TIME_INTERVAL,
  MININUM_NUMBER_OF_PEOS_MINTED
} from './utils/constants'
import polling from 'light-async-polling'

class pEOS {
  /**
   * @param {Object} _configs
   * @param {Object=} null - _web3
   */
  constructor(_configs, _web3 = null) {
    this.eosjs = _getEosJsApi(_configs.eosPrivateKey, _configs.eosProvider)
    this.enclave = new Enclave()
    if (_web3) {
      this.isWeb3Injected = true
      this.web3 = _web3
    } else {
      this.web3 = new Web3(_configs.ethProvider)
      const account = this.web3.eth.accounts.privateKeyToAccount(_configs.ethPrivateKey)
      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = _configs.ethPrivateKey
    }
  }

  /**
   * @param {Integer} _amount
   * @param {String} _ethAddress
   */
  issue(_amount, _ethAddress) {
    if (_amount < MININUM_NUMBER_OF_PEOS_MINTED)
      throw new Error('Amount to issue must be greater than 1 pEOS')

    if (!this.web3.utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        const pubkeys = await this.eosjs.signatureProvider.getAvailableKeys()
        const accounts = await this.eosjs.rpc.history_get_key_accounts(pubkeys[0])
        const eosAccountName = accounts.account_names[0]
        const accurateAmount = _amount.toFixed(4)
        let res = await this.eosjs.transact({
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
              memo: _ethAddress
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        promiEvent.eventEmitter.emit('onEosTxConfirmed', res)

        const polledTx = res.transaction_id
        let broadcastedTx = ''
        let isSeen = false
        await polling(async () => {
          res = await this.enclave.getIncomingTransactionStatus(polledTx)
          if (res.broadcast === false && !isSeen) {
            promiEvent.eventEmitter.emit('onEnclaveReceivedTx', res)
            isSeen = true
            return false
          } else if (res.broadcast === true) {
            // NOTE: could happen that eos tx is confirmed before enclave received it
            if (!isSeen)
              promiEvent.eventEmitter.emit('onEnclaveReceivedTx', res)

            promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', res)
            broadcastedTx = res.broadcast_transaction_hash
            return true
          } else {
            return false
          }
        }, ENCLAVE_POLLING_TIME)

        await polling(async () => {
          res = await this.web3.eth.getTransactionReceipt(broadcastedTx)
          if (res) {
            if (res.status) {
              promiEvent.eventEmitter.emit('onEthTxConfirmed', res)

              return true
            } else {
              return false
            }
          } else {
            return false
          }
        }, ETH_NODE_POLLING_TIME_INTERVAL)

        promiEvent.resolve({
          totalIssued: _amount.toFixed(TOKEN_DECIMALS),
          to: _ethAddress,
          tx: broadcastedTx
        })
      }
      start()
    } catch (e) {
      promiEvent.reject(e)
    }
    return promiEvent.eventEmitter
  }

  /**
   * @param {Integer} _amount
   * @param {String} _eosAccount
   */
  redeem(_amount, _eosAccount, _callback) {
    if (_amount === 0)
      throw new Error('Impossible to burn 0 pEOS')

    if (!_isValidEosAccount(_eosAccount))
      throw new Error('Invalid Eos account provided')

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        let res = null
        const accurateAmount = _amount * Math.pow(10, TOKEN_DECIMALS)
        if (!this.isWeb3Injected) {
          res = await _sendSignedTx(
            this.web3,
            this.ethPrivateKey,
            'burn',
            [
              accurateAmount,
              _eosAccount
            ]
          )
        } else {
          const account = await _getEthAccount(this.web3)
          const contract = _getEthContract(this.web3, account)
          res = await contract.methods.burn(_amount, _eosAccount).send({
            from: account
          })
        }
        promiEvent.eventEmitter.emit('onEthTxConfirmed', res)

        const polledTx = res.transactionHash
        let broadcastedTx = ''
        let isSeen = false
        await polling(async () => {
          res = await this.enclave.getIncomingTransactionStatus(polledTx)
          if (res.broadcast === false && !isSeen) {
            promiEvent.eventEmitter.emit('onEnclaveReceivedTx', res)
            isSeen = true
            return false
          } else if (res.broadcast === true) {
            if (!isSeen)
              promiEvent.eventEmitter.emit('onEnclaveReceivedTx', res)

            promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', res)
            broadcastedTx = res.broadcast_transaction_hash
            return true
          } else {
            return false
          }
        }, ENCLAVE_POLLING_TIME)

        await polling(async () => {
          res = await this.eosjs.rpc.history_get_transaction(broadcastedTx)
          if (res.trx.receipt.status === 'executed') {
            promiEvent.eventEmitter.emit('onEosTxConfirmed', res.data)
            return true
          } else {
            return false
          }
        }, EOS_NODE_POLLING_TIME_INTERVAL)

        promiEvent.resolve({
          totalRedeemed: _amount.toFixed(TOKEN_DECIMALS),
          to: _eosAccount,
          tx: broadcastedTx
        })
      }
      start()
    } catch (e) {
      promiEvent.reject(e)
    }
    return promiEvent.eventEmitter
  }

  getTotalIssued() {
    return _getTotalOf(
      this.web3,
      'totalMinted',
      this.isWeb3Injected
    )
  }

  getTotalRedeemed() {
    return _getTotalOf(
      this.web3,
      'totalBurned',
      this.isWeb3Injected
    )
  }

  getCirculatingSupply() {
    return _getTotalOf(
      this.web3,
      'totalSupply',
      this.isWeb3Injected
    )
  }
}

export default pEOS
