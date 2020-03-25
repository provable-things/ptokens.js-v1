import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { eth, eos, btc, helpers } from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import { BtcDepositAddress } from './btc-deposit-address'
import pbtcAbi from './utils/contractAbi/pBTCTokenETHContractAbi.json'
import peosAbi from './utils/contractAbi/pBTCTokenEOSContractAbi.json'
import {
  MINIMUM_BTC_REDEEMABLE,
  BTC_ESPLORA_POLLING_TIME,
  EOS_BLOCKS_BEHIND,
  EOS_EXPIRE_SECONDS,
  BTC_DECIMALS,
  hostBlockchainEvents
} from './utils/constants'

export class pBTC extends NodeSelector {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork
    } = helpers.parseParams(_configs, 'bitcoin')

    super({
      pToken: 'pBTC',
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultEndpoint: _configs.defaultEndpoint
    })

    const {
      ethPrivateKey,
      ethProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider
    } = _configs

    if (
      (ethProvider || ethPrivateKey) &&
      (eosSignatureProvider || eosPrivateKey)
    )
      throw new Error('Bad Initialization. Impossible to use Both ETH and EOS')

    if (ethProvider) this.hostApi = new Web3(ethProvider)

    if (ethPrivateKey) {
      this._ishostApiInjected = false
      const account = this.hostApi.eth.accounts.privateKeyToAccount(
        eth.addHexPrefix(ethPrivateKey)
      )

      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
      this._ishostApiInjected = false
    } else {
      this._ishostApiInjected = true
      this.hostPrivateKey = null
    }

    if (eosSignatureProvider) {
      this.hostApi = eos.getApi(null, eosRpc, eosSignatureProvider)
    } else if (eosPrivateKey && eosRpc) {
      this.hostApi = eos.getApi(eosPrivateKey, eosRpc, null)
      this.hostPrivateKey = eosPrivateKey
    } else if (!eosSignatureProvider && !eosPrivateKey && eosRpc) {
      this.hostApi = eos.getApi(null, eosRpc, null)
    }

    this.contractAddress = null
    this.decimals = null
  }

  /**
   * @param {String} _hostAddress
   */
  async getDepositAddress(_hostAddress) {
    if (
      this.hostBlockchain === 'ethereum' &&
      !Web3Utils.isAddress(_hostAddress)
    )
      throw new Error('Eth Address is not valid')

    if (this.hostBlockchain === 'eos' && !eos.isValidAccountName(_hostAddress))
      throw new Error('EOS Address is not valid')

    const depositAddress = new BtcDepositAddress({
      nativeNetwork: helpers.getNetworkType(this.nativeNetwork),
      node: this.selectedNode ? this.selectedNode : await this.select(),
      hostBlockchain: this.hostBlockchain,
      hostNetwork: this.hostNetwork,
      hostApi: this.hostApi
    })

    await depositAddress.generate(_hostAddress)

    if (!depositAddress.verify())
      throw new Error('Node deposit address does not match expected address')

    return depositAddress
  }

  /**
   * @param {Number} _amount
   * @param {String} _btcAddress
   */
  redeem(_amount, _btcAddress) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (_amount < MINIMUM_BTC_REDEEMABLE) {
        promiEvent.reject(
          `Impossible to burn less than ${MINIMUM_BTC_REDEEMABLE} pBTC`
        )
        return
      }

      if (!btc.isValidAddress(_btcAddress)) {
        promiEvent.reject('Btc Address is not valid')
        return
      }

      try {
        if (!this.selectedNode) await this.select()

        const decimals = await this._getDecimals()
        const contractAddress = await this._getContractAddress()

        let hostTxReceiptId = null

        if (this.hostBlockchain === 'ethereum') {
          const hostTxReceipt = await eth.makeContractSend(
            this.hostApi,
            'redeem',
            {
              isWeb3Injected: this._ishostApiInjected,
              abi: pbtcAbi,
              contractAddress,
              privateKey: this.hostPrivateKey,
              value: eth.zeroEther
            },
            [eth.correctFormat(_amount, decimals, '*').toString(), _btcAddress]
          )
          promiEvent.eventEmitter.emit(
            hostBlockchainEvents[this.hostBlockchain],
            hostTxReceipt
          )
          hostTxReceiptId = hostTxReceipt.transactionHash
        }

        // NOTE redeem from eos
        if (this.hostBlockchain === 'eos') {
          const eosPublicKeys = await this.hostApi.signatureProvider.getAvailableKeys()

          const eosAccountName = await eos.getAccountName(
            this.hostApi.rpc,
            eosPublicKeys
          )

          this.hostApi.cachedAbis.set(contractAddress, {
            abi: peosAbi,
            rawAbi: null
          })

          const hostTxReceipt = await this.hostApi.transact(
            {
              actions: [
                {
                  account: contractAddress,
                  name: 'redeem',
                  authorization: [
                    {
                      actor: eosAccountName,
                      permission: 'active'
                    }
                  ],
                  data: {
                    sender: eosAccountName,
                    quantity: eos.getAmountInEosFormat(
                      _amount,
                      decimals,
                      'PBTC'
                    ),
                    memo: _btcAddress
                  }
                }
              ]
            },
            {
              blocksBehind: EOS_BLOCKS_BEHIND,
              expireSeconds: EOS_EXPIRE_SECONDS
            }
          )

          promiEvent.eventEmitter.emit(
            hostBlockchainEvents[this.hostBlockchain],
            hostTxReceipt
          )
          hostTxReceiptId = hostTxReceipt.transaction_id
        }

        const broadcastedBtcTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxReceiptId,
          promiEvent.eventEmitter
        )

        const broadcastedBtcTx = await btc.waitForTransactionConfirmation(
          this.this.nativeNetwork,
          broadcastedBtcTxReport.broadcast_tx_hash,
          BTC_ESPLORA_POLLING_TIME
        )
        promiEvent.eventEmitter.emit('onBtcTxConfirmed', broadcastedBtcTx)

        promiEvent.resolve({
          amount: _amount.toFixed(decimals),
          to: _btcAddress,
          tx: broadcastedBtcTxReport.broadcast_tx_hash
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  async _getContractAddress() {
    if (!this.contractAddress) {
      if (!this.selectedNode) await this.select()
      const info = await this.selectedNode.getInfo()
      this.contractAddress = info.smart_contract_address
    }

    return this.contractAddress
  }

  async _getDecimals() {
    if (!this.decimals) {
      if (this.hostBlockchain === 'eth') {
        this.decimals = await eth.makeContractCall(this.hostApi, 'decimals', {
          isWeb3Injected: this._ishostApiInjected,
          abi: pbtcAbi,
          contractAddress: this._getContractAddress()
        })
      }
      if (this.hostBlockchain === 'eos') this.decimals = BTC_DECIMALS
    }
    return this.decimals
  }
}
