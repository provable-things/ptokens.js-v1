import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'
import {
  EOS_BLOCKS_BEHIND,
  EOS_EXPIRE_SECONDS,
  EOS_NATIVE_TOKEN,
  EOS_NODE_POLLING_TIME_INTERVAL,
  EOS_TRANSACTION_EXECUTED,
  EOS_TOKEN_SYMBOL,
  ENCLAVE_POLLING_TIME,
  ETH_NODE_POLLING_TIME_INTERVAL,
  MINIMUM_MINTABLE_PEOS_AMOUNT,
  PEOS_TOKEN_DECIMALS,
  PEOS_EOS_CONTRACT_ACCOUNT,
  PEOS_ETH_CONTRACT_ADDRESS
} from './utils/constants'
import peosAbi from './utils/contractAbi/pEOSTokenETHContractAbi.json'
import polling from 'light-async-polling'

class pEOS {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      ethPrivateKey,
      ethProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider
    } = _configs

    this.enclave = new Enclave({
      pToken: 'peos'
    })

    this.web3 = new Web3(ethProvider)

    if (ethPrivateKey) {
      this.isWeb3Injected = false
      const account = this.web3.eth.accounts.privateKeyToAccount(
        utils.eth.addHexPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = utils.eth.addHexPrefix(ethPrivateKey)
      this.isWeb3Injected = false
    } else {
      this.isWeb3Injected = true
      this.ethPrivateKey = null
    }

    if (eosSignatureProvider)
      this.eosjs = utils.eos.getApi(null, eosRpc, eosSignatureProvider)
    else if (
      eosPrivateKey &&
      eosRpc
    ) this.eosjs = utils.eos.getApi(eosPrivateKey, eosRpc, null)
  }

  /**
   * @param {Number} _amount
   * @param {String} _ethAddress
   */
  issue(_amount, _ethAddress) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (_amount < MINIMUM_MINTABLE_PEOS_AMOUNT) {
        promiEvent.reject('Amount to issue must be greater than 1 pEOS')
        return
      }

      if (!this.web3.utils.isAddress(_ethAddress)) {
        promiEvent.reject('Eth Address is not valid')
        return
      }

      try {
        const eosPublicKeys = await utils.eos.getAvailablePublicKeys(this.eosjs)
        const eosAccountName = await utils.eos.getAccountName(this.eosjs, eosPublicKeys)
        const eosTxReceipt = await utils.eos.transferNativeToken(
          this.eosjs,
          PEOS_EOS_CONTRACT_ACCOUNT,
          eosAccountName,
          _amount,
          _ethAddress,
          EOS_BLOCKS_BEHIND,
          EOS_EXPIRE_SECONDS
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
          amount: _amount.toFixed(PEOS_TOKEN_DECIMALS),
          to: _ethAddress,
          tx: broadcastedTx
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  /**
   * @param {Number} _amount
   * @param {String} _eosAccountName
   */
  redeem(_amount, _eosAccountName) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (_amount === 0) {
        promiEvent.reject('Impossible to burn 0 pEOS')
        return
      }

      if (!utils.eos.isValidAccountName(_eosAccountName)) {
        promiEvent.reject('Eos Account is not valid')
        return
      }

      try {
        const ethTxReceipt = await utils.eth.makeContractSend(
          this.web3,
          'burn',
          {
            isWeb3Injected: this.isWeb3Injected,
            abi: peosAbi,
            contractAddress: PEOS_ETH_CONTRACT_ADDRESS,
            privateKey: this.ethPrivateKey,
            value: utils.eth.zeroEther
          },
          [
            utils.eth.correctFormat(
              _amount,
              PEOS_TOKEN_DECIMALS,
              '*'
            ),
            _eosAccountName
          ]
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
          amount: _amount.toFixed(PEOS_TOKEN_DECIMALS),
          to: _eosAccountName,
          tx: broadcastedTx
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  getTotalIssued() {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'totalMinted',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        }
      )
        .then(totalIssued => resolve(
          utils.eth.correctFormat(
            parseInt(totalIssued),
            PEOS_TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  getTotalRedeemed() {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'totalBurned',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        }
      )
        .then(totalRedeemed => resolve(
          utils.eth.correctFormat(
            parseInt(totalRedeemed),
            PEOS_TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  getCirculatingSupply() {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'totalSupply',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        }
      )
        .then(totalSupply => resolve(
          utils.eth.correctFormat(
            parseInt(totalSupply),
            PEOS_TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }

  getCollateral() {
    return new Promise((resolve, reject) => {
      this.eosjs.rpc.get_currency_balance(
        EOS_NATIVE_TOKEN,
        PEOS_EOS_CONTRACT_ACCOUNT,
        EOS_TOKEN_SYMBOL
      )
        .then(deposited => resolve(
          deposited
        ))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _ethAddress
   */
  getBalance(_ethAddress) {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'balanceOf',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        },
        [
          _ethAddress
        ]
      )
        .then(balance => resolve(
          utils.eth.correctFormat(
            parseInt(balance),
            PEOS_TOKEN_DECIMALS,
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
    return utils.eth.makeContractSend(
      this.web3,
      'transfer',
      {
        isWeb3Injected: this.isWeb3Injected,
        abi: peosAbi,
        contractAddress: PEOS_ETH_CONTRACT_ADDRESS,
        privateKey: this.ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _to,
        utils.eth.correctFormat(
          parseInt(_amount),
          PEOS_TOKEN_DECIMALS,
          '*'
        )
      ]
    )
  }

  /**
   * @param {String} _spender
   * @param {Number} _amount
   */
  approve(_spender, _amount) {
    return utils.eth.makeContractSend(
      this.web3,
      'approve',
      {
        isWeb3Injected: this.isWeb3Injected,
        abi: peosAbi,
        contractAddress: PEOS_ETH_CONTRACT_ADDRESS,
        privateKey: this.ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _spender,
        utils.eth.correctFormat(
          parseInt(_amount),
          PEOS_TOKEN_DECIMALS,
          '*'
        )
      ]
    )
  }

  /**
   * @param {String} _from
   * @param {String} _to
   * @param {Number} _amount
   */
  transferFrom(_from, _to, _amount) {
    return utils.eth.makeContractSend(
      this.web3,
      'transferFrom',
      {
        isWeb3Injected: this.isWeb3Injected,
        abi: peosAbi,
        contractAddress: PEOS_ETH_CONTRACT_ADDRESS,
        privateKey: this.ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _from,
        _to,
        utils.eth.correctFormat(
          parseInt(_amount),
          PEOS_TOKEN_DECIMALS,
          '*'
        )
      ]
    )
  }

  getBurnNonce() {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'burnNonce',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        }
      )
        .then(burnNonce => resolve(
          parseInt(burnNonce)
        ))
        .catch(err => reject(err))
    })
  }

  getMintNonce() {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'mintNonce',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        }
      )
        .then(mintNonce => resolve(
          parseInt(mintNonce)
        ))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _owner
   * @param {Address} _spender
   */
  getAllowance(_owner, _spender) {
    return new Promise((resolve, reject) => {
      utils.eth.makeContractCall(
        this.web3,
        'allowance',
        {
          isWeb3Injected: this.isWeb3Injected,
          abi: peosAbi,
          contractAddress: PEOS_ETH_CONTRACT_ADDRESS
        },
        [
          _owner,
          _spender
        ]
      )
        .then(allowance => resolve(
          utils.eth.correctFormat(
            parseInt(allowance),
            PEOS_TOKEN_DECIMALS,
            '/'
          )
        ))
        .catch(err => reject(err))
    })
  }
}

export default pEOS
