import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, eth, eos, btc, helpers } from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import { BtcDepositAddress } from './btc-deposit-address'
import { redeemFromEthereum } from './lib/redeem-from-ethereum'
import { redeemFromEosio } from './lib/redeem-from-eosio'
import {
  MINIMUM_BTC_REDEEMABLE,
  BTC_ESPLORA_POLLING_TIME,
  BTC_DECIMALS
} from './utils/constants'
import pbtcOnEthAbi from './utils/contractAbi/pBTCTokenETHContractAbi.json'

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
    } = helpers.parseParams(_configs, constants.blockchains.Bitcoin)

    super({
      pToken: constants.pTokens.pBTC,
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

    // NOTE: parse eth params
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

    // NOTE: parse eos params
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
      this.hostBlockchain === constants.blockchains.Ethereum &&
      !Web3Utils.isAddress(_hostAddress)
    )
      throw new Error('Eth Address is not valid')

    if (
      this.hostBlockchain === constants.blockchains.Eosio &&
      !eos.isValidAccountName(_hostAddress)
    )
      throw new Error('EOS Account is not valid')

    const selectedNode = this.selectedNode
      ? this.selectedNode
      : await this.select()
    if (!selectedNode) {
      throw new Error(
        'No node selected. Impossible to generate a BTC deposit Address.'
      )
    }

    const depositAddress = new BtcDepositAddress({
      nativeNetwork: helpers.getNetworkType(this.nativeNetwork),
      node: selectedNode,
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

        if (this.hostBlockchain === constants.blockchains.Ethereum) {
          const ethTxReceipt = await redeemFromEthereum(
            this.hostApi,
            _amount,
            decimals,
            _btcAddress,
            contractAddress,
            this.hostPrivateKey,
            this._ishostApiInjected
          )

          promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
          promiEvent.eventEmitter.emit('hostTxConfirmed', ethTxReceipt)

          hostTxReceiptId = ethTxReceipt.transactionHash
        }

        if (this.hostBlockchain === constants.blockchains.Eosio) {
          const eosTxReceipt = await redeemFromEosio(
            this.hostApi,
            _amount,
            _btcAddress,
            decimals,
            contractAddress
          )

          promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt)
          promiEvent.eventEmitter.emit('hostTxConfirmed', eosTxReceipt)

          hostTxReceiptId = eosTxReceipt.transaction_id
        }

        const broadcastedBtcTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxReceiptId,
          promiEvent.eventEmitter
        )

        const broadcastedBtcTx = await btc.waitForTransactionConfirmation(
          this.nativeNetwork,
          broadcastedBtcTxReport.broadcast_tx_hash,
          BTC_ESPLORA_POLLING_TIME
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', broadcastedBtcTx)
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
      if (this.hostBlockchain === constants.blockchains.Ethereum) {
        this.decimals = await eth.makeContractCall(this.hostApi, 'decimals', {
          isWeb3Injected: this._ishostApiInjected,
          abi: pbtcOnEthAbi,
          contractAddress: this._getContractAddress()
        })
      }
      if (this.hostBlockchain === constants.blockchains.Eosio)
        this.decimals = BTC_DECIMALS
    }
    return this.decimals
  }
}
