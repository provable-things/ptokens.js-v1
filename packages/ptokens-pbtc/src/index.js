import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import Esplora from './lib/esplora'
import DepositAddress from './lib/deposit-address'
import polling from 'light-async-polling'
import pbtcAbi from './utils/contractAbi/pBTCTokenETHContractAbi.json'
import {
  ESPLORA_POLLING_TIME,
  ENCLAVE_POLLING_TIME,
  PBTC_TOKEN_DECIMALS,
  PBTC_ETH_CONTRACT_ADDRESS
} from './utils/constants'

class pBTC {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      web3,
      ethPrivateKey,
      ethProvider,
      btcNetwork
    } = _configs

    this.enclave = new Enclave({
      pToken: 'pbtc'
    })

    if (web3) {
      this.isWeb3Injected = true
      this.web3 = web3
      this.ethPrivateKey = null
    } else if (
      ethPrivateKey &&
      ethProvider
    ) {
      this.web3 = new Web3(ethProvider)

      const account = this.web3.eth.accounts.privateKeyToAccount(
        utils.eth.addHexPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = utils.eth.addHexPrefix(ethPrivateKey)
      this.isWeb3Injected = false
    }

    if (
      btcNetwork === 'bitcoin' ||
      btcNetwork === 'testnet'
    )
      this.btcNetwork = btcNetwork
    else
      this.btcNetwork = 'testnet'

    this.esplora = new Esplora(this.btcNetwork)
  }

  /**
   * @param {String} _ethAddress
   */
  async getDepositAddress(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    const deposit = await this.enclave.generic(
      'GET',
      `get-btc-deposit-address/${this.btcNetwork}/${_ethAddress}`
    )

    const depositAddress = new DepositAddress({
      ethAddress: _ethAddress,
      nonce: deposit.nonce,
      enclavePublicKey: deposit.enclavePublicKey,
      value: deposit.btcDepositAddress,
      btcNetwork: this.btcNetwork,
      esplora: this.esplora,
    })

    if (!depositAddress.verify())
      throw new Error('Enclave deposit address does not match expected address')

    return depositAddress
  }

  /**
   * @param {Number} _amount
   * @param {String} _eosAccountName
   */
  redeem(_amount, _btcAddress) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (_amount === 0) {
        promiEvent.reject('Impossible to burn 0 pBTC')
        return
      }

      if (!utils.btc.isValidAddress(_btcAddress)) {
        promiEvent.reject('Btc Address is not valid')
        return
      }

      try {
        const ethTxReceipt = await utils.eth.makeContractSend(
          this.web3,
          'burn',
          {
            isWeb3Injected: this.isWeb3Injected,
            abi: pbtcAbi,
            contractAddress: PBTC_ETH_CONTRACT_ADDRESS,
            privateKey: this.ethPrivateKey,
            value: utils.eth.zeroEther
          },
          [
            utils.eth.correctFormat(
              _amount,
              PBTC_TOKEN_DECIMALS,
              '*'
            ),
            _btcAddress
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

          //TODO: check bitcoin tx status
        }, ESPLORA_POLLING_TIME)

        promiEvent.resolve({
          amount: _amount.toFixed(PBTC_TOKEN_DECIMALS),
          to: _btcAddress,
          tx: broadcastedTx
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

}

export default pBTC
