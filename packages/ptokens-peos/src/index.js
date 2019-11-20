import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import Enclave from 'ptokens-enclave'
import {
  _alwaysWithPrefix,
  _correctEthFormat,
  _makeTransaction,
  _makeContractCall
} from './utils/eth'
import {
  _eosTransactToProvabletokn,
  _getEosAccountName,
  _getEosAvailablePublicKeys,
  _getEosJsApi,
  _isValidEosAccountName
} from './utils/eos'
import {
  EOS_NODE_POLLING_TIME_INTERVAL,
  EOS_TRANSACTION_EXECUTED,
  ENCLAVE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL,
  MINIMUM_MINTABLE_PEOS_AMOUNT,
  TOKEN_DECIMALS
} from './utils/constants'
import polling from 'light-async-polling'

class pEOS {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      web3,
      eosjs,
      ethPrivateKey,
      ethProvider,
      eosPrivateKey,
      eosProvider
    } = _configs

    this.enclave = new Enclave()

    if (web3) {
      this.isWeb3Injected = true
      this.web3 = web3
      this.ethPrivateKey = null
    } else {
      this.web3 = new Web3(ethProvider)

      const account = this.web3.eth.accounts.privateKeyToAccount(
        _alwaysWithPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = _alwaysWithPrefix(ethPrivateKey)
      this.isWeb3Injected = false
    }

    if (eosjs)
      this.eosjs = eosjs
    else
      this.eosjs = _getEosJsApi(eosPrivateKey, eosProvider)
  }

  /**
   * @param {Number} _amount
   * @param {String} _ethAddress
   */
  issue(_amount, _ethAddress) {
    if (_amount < MINIMUM_MINTABLE_PEOS_AMOUNT)
      throw new Error('Amount to issue must be greater than 1 pEOS')

    if (!this.web3.utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        const eosPublicKeys = await _getEosAvailablePublicKeys(this.eosjs)
        const eosAccountName = await _getEosAccountName(this.eosjs, eosPublicKeys)
        const eosTxReceipt = await _eosTransactToProvabletokn(
          this.eosjs,
          eosAccountName,
          _amount,
          _ethAddress
        )

        promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt)

        const polledTx = eosTxReceipt.transaction_id
        let broadcastedTx = ''
        let isSeen = false

        await polling(async () => {
          const incomingTxStatus = await this.enclave.getIncomingTransactionStatus(polledTx)

          if (incomingTxStatus.broadcast === false && !isSeen) {
            promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)
            isSeen = true
            return false
          } else if (incomingTxStatus.broadcast === true) {
            // NOTE: could happen that eos tx is confirmed before enclave received it
            if (!isSeen)
              promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)

            promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', incomingTxStatus)
            broadcastedTx = incomingTxStatus.broadcast_transaction_hash
            return true
          } else {
            return false
          }
        }, ENCLAVE_POLLING_TIME)

        await polling(async () => {
          const ethTxReceipt = await this.web3.eth.getTransactionReceipt(broadcastedTx)
          if (!ethTxReceipt) {
            return false
          } else if (ethTxReceipt.status) {
            promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
            return true
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
   * @param {Number} _amount
   * @param {String} _eosAccountName
   */
  redeem(_amount, _eosAccountName) {
    if (_amount === 0)
      throw new Error('Impossible to burn 0 pEOS')

    if (!_isValidEosAccountName(_eosAccountName))
      throw new Error('Invalid Eos account provided')

    const promiEvent = Web3PromiEvent()

    try {
      const start = async () => {
        const ethTxReceipt = await _makeTransaction(
          this.web3,
          'burn',
          this.isWeb3Injected,
          [
            _correctEthFormat(
              _amount,
              TOKEN_DECIMALS,
              '*'
            ),
            _eosAccountName
          ],
          this.ethPrivateKey
        )

        promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)

        const polledTx = ethTxReceipt.transactionHash
        let broadcastedTx = null
        let isSeen = false

        await polling(async () => {
          const incomingTxStatus = await this.enclave.getIncomingTransactionStatus(polledTx)

          if (incomingTxStatus.broadcast === false && !isSeen) {
            promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)
            isSeen = true
            return false
          } else if (incomingTxStatus.broadcast === true) {
            if (!isSeen)
              promiEvent.eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)

            promiEvent.eventEmitter.emit('onEnclaveBroadcastedTx', incomingTxStatus)
            broadcastedTx = incomingTxStatus.broadcast_transaction_hash
            return true
          } else {
            return false
          }
        }, ENCLAVE_POLLING_TIME)

        await polling(async () => {
          const eosTxReceipt = await this.eosjs.rpc.history_get_transaction(broadcastedTx)

          if (eosTxReceipt.trx.receipt.status === EOS_TRANSACTION_EXECUTED) {
            promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt.data)
            return true
          } else {
            return false
          }
        }, EOS_NODE_POLLING_TIME_INTERVAL)

        promiEvent.resolve({
          totalRedeemed: _amount.toFixed(TOKEN_DECIMALS),
          to: _eosAccountName,
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
    return new Promise((resolve, reject) => {
      _makeContractCall(
        this.web3,
        'totalMinted',
        this.isWeb3Injected
      )
        .then(totalIssued => resolve(
          _correctEthFormat(
            parseInt(totalIssued),
            TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  getTotalRedeemed() {
    return new Promise((resolve, reject) => {
      _makeContractCall(
        this.web3,
        'totalBurned',
        this.isWeb3Injected
      )
        .then(totalRedeemed => resolve(
          _correctEthFormat(
            parseInt(totalRedeemed),
            TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  getCirculatingSupply() {
    return new Promise((resolve, reject) => {
      _makeContractCall(
        this.web3,
        'totalSupply',
        this.isWeb3Injected
      )
        .then(totalSupply => resolve(
          _correctEthFormat(
            parseInt(totalSupply),
            TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _ethAccount
   */
  getBalance(_ethAccount) {
    return new Promise((resolve, reject) => {
      _makeContractCall(
        this.web3,
        'balanceOf',
        this.isWeb3Injected,
        [
          _ethAccount
        ]
      )
        .then(balance => resolve(
          _correctEthFormat(
            parseInt(balance),
            TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _to
   * @param {Number} _amount
   */
  transfer(_to, _amount) {
    return _makeTransaction(
      this.web3,
      'transfer',
      this.isWeb3Injected,
      [
        _to,
        _correctEthFormat(
          parseInt(_amount),
          TOKEN_DECIMALS,
          '*'
        )
      ],
      this.ethPrivateKey
    )
  }

  /**
   * @param {String} _spender
   * @param {Number} _amount
   */
  approve(_spender, _amount) {
    return _makeTransaction(
      this.web3,
      'approve',
      this.isWeb3Injected,
      [
        _spender,
        _correctEthFormat(
          parseInt(_amount),
          TOKEN_DECIMALS,
          '*'
        )
      ],
      this.ethPrivateKey
    )
  }

  /**
   * @param {String} _from
   * @param {String} _to
   * @param {Number} _amount
   */
  transferFrom(_from, _to, _amount) {
    return _makeTransaction(
      this.web3,
      'transferFrom',
      this.isWeb3Injected,
      [
        _from,
        _to,
        _correctEthFormat(
          parseInt(_amount),
          TOKEN_DECIMALS,
          '*'
        )
      ],
      this.ethPrivateKey
    )
  }

  getBurnNonce() {
    return _makeContractCall(
      this.web3,
      'burnNonce',
      this.isWeb3Injected
    )
  }

  getMintNonce() {
    return _makeContractCall(
      this.web3,
      'mintNonce',
      this.isWeb3Injected
    )
  }

  /**
   * @param {String} _owner
   * @param {Address} _spender
   */
  getAllowance(_owner, _spender) {
    return new Promise((resolve, reject) => {
      _makeContractCall(
        this.web3,
        'allowance',
        this.isWeb3Injected,
        [
          _owner,
          _spender
        ]
      )
        .then(allowance => resolve(
          _correctEthFormat(
            parseInt(allowance),
            TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }
}

export default pEOS
