import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { eth, btc } from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import { BtcDepositAddress } from './btc-deposit-address'
import pbtcAbi from './utils/contractAbi/pBTCTokenETHContractAbi.json'
import {
  MINIMUM_BTC_REDEEMABLE,
  BTC_ESPLORA_POLLING_TIME
} from './utils/constants'

export class pBTC {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { ethPrivateKey, ethProvider, btcNetwork, defaultEndpoint } = _configs

    this._web3 = new Web3(ethProvider)

    if (ethPrivateKey) {
      this._isWeb3Injected = false
      const account = this._web3.eth.accounts.privateKeyToAccount(
        eth.addHexPrefix(ethPrivateKey)
      )

      this._web3.eth.defaultAccount = account.address
      this._ethPrivateKey = eth.addHexPrefix(ethPrivateKey)
      this._isWeb3Injected = false
    } else {
      this._isWeb3Injected = true
      this._ethPrivateKey = null
    }

    if (btcNetwork === 'bitcoin' || btcNetwork === 'testnet')
      this._btcNetwork = btcNetwork
    else this._btcNetwork = 'testnet'

    this.nodeSelector = new NodeSelector({
      pToken: {
        name: 'pBTC',
        redeemFrom: 'ETH'
      },
      defaultEndpoint,
      networkType: this._btcNetwork
    })

    this._contractAddress = null
    this._decimals = null
  }

  /**
   * @param {String} _ethAddress
   */
  async getDepositAddress(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()

    const decimals = await this._getDecimals()

    const depositAddress = new BtcDepositAddress({
      network: this._btcNetwork,
      node: this.nodeSelector.selectedNode,
      web3: this._web3,
      decimals
    })

    await depositAddress.generate(_ethAddress)

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
        if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()

        const decimals = await this._getDecimals()
        const contractAddress = await this._getContractAddress()

        const ethTxReceipt = await eth.makeContractSend(
          this._web3,
          'redeem',
          {
            isWeb3Injected: this._isWeb3Injected,
            abi: pbtcAbi,
            contractAddress,
            privateKey: this._ethPrivateKey,
            value: eth.zeroEther
          },
          [eth.correctFormat(_amount, decimals, '*').toString(), _btcAddress]
        )
        promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)

        const broadcastedBtcTxReport = await this.nodeSelector.selectedNode.monitorIncomingTransaction(
          ethTxReceipt.transactionHash,
          promiEvent.eventEmitter
        )

        const broadcastedBtcTx = await btc.waitForTransactionConfirmation(
          this._btcNetwork,
          broadcastedBtcTxReport.native_tx_hash,
          BTC_ESPLORA_POLLING_TIME
        )
        promiEvent.eventEmitter.emit('onBtcTxConfirmed', broadcastedBtcTx)

        promiEvent.resolve({
          amount: _amount.toFixed(decimals),
          to: _btcAddress,
          tx: broadcastedBtcTxReport.native_tx_hash
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  async _getContractAddress() {
    if (!this._contractAddress) {
      if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()
      const info = await this.nodeSelector.selectedNode.getInfo()
      this._contractAddress = info.smart_contract_address
    }

    return this._contractAddress
  }

  async _getDecimals() {
    if (!this.decimals) {
      this.decimals = await eth.makeContractCall(this._web3, 'decimals', {
        isWeb3Injected: this._isWeb3Injected,
        abi: pbtcAbi,
        contractAddress: this._getContractAddress()
      })
    }
    return this.decimals
  }
}
