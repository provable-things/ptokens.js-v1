import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { eth, eos, btc } from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import { BtcDepositAddress } from './btc-deposit-address'
import pbtcAbi from './utils/contractAbi/pBTCTokenETHContractAbi.json'
import peosAbi from './utils/contractAbi/pBTCTokenEOSContractAbi.json'
import {
  MINIMUM_BTC_REDEEMABLE,
  BTC_ESPLORA_POLLING_TIME,
  EOS_BLOCKS_BEHIND,
  EOS_EXPIRE_SECONDS,
  hostBlockchainEvents
} from './utils/constants'

export class pBTC {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      hostBlockchain,
      ethPrivateKey,
      ethProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider,
      btcNetwork,
      defaultEndpoint
    } = _configs

    if (!hostBlockchain)
      throw new Error('Bad Initialization. hostBlockchain is nedeed')

    this.hostBlockchain = hostBlockchain.toLowerCase()
    if (this.hostBlockchain !== 'eth' && this.hostBlockchain !== 'eos')
      throw new Error(
        'Bad Initialization. Please provide a valid hostBlockchain value'
      )

    if (
      (ethProvider || ethPrivateKey) &&
      (eosSignatureProvider || eosPrivateKey)
    )
      throw new Error('Bad Initialization. Impossible to use Both ETH and EOS')

    if (ethProvider) this.hostProvider = new Web3(ethProvider)

    if (ethPrivateKey) {
      this._isHostProviderInjected = false
      const account = this.hostProvider.eth.accounts.privateKeyToAccount(
        eth.addHexPrefix(ethPrivateKey)
      )

      this.hostProvider.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
      this._isHostProviderInjected = false
    } else {
      this._isHostProviderInjected = true
      this.hostPrivateKey = null
    }

    if (eosSignatureProvider)
      this.hostProvider = eos.getApi(null, eosRpc, eosSignatureProvider)
    else if (eosPrivateKey && eosRpc) {
      this.hostProvider = eos.getApi(eosPrivateKey, eosRpc, null)
      this.hostPrivateKey = eosPrivateKey
    } else if (!eosSignatureProvider && !eosPrivateKey && eosRpc)
      this.hostProvider = eos.getApi(null, eosRpc, null)

    if (btcNetwork === 'bitcoin' || btcNetwork === 'testnet')
      this._btcNetwork = btcNetwork
    else this._btcNetwork = 'testnet'

    this.nodeSelector = new NodeSelector({
      pToken: {
        name: 'pBTC',
        hostBlockchain
      },
      defaultEndpoint,
      networkType: this._btcNetwork
    })

    this.contractAddress = null
    this.decimals = null
  }

  /**
   * @param {String} _hostAddress
   */
  async getDepositAddress(_hostAddress) {
    if (this.hostBlockchain === 'eth' && !Web3Utils.isAddress(_hostAddress))
      throw new Error('Eth Address is not valid')

    if (this.hostBlockchain === 'eos' && !eos.isValidAccountName(_hostAddress))
      throw new Error('EOS Address is not valid')

    if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()

    const decimals = this.hostProvider ? await this._getDecimals() : 1

    const depositAddress = new BtcDepositAddress({
      network: this._btcNetwork,
      node: this.nodeSelector.selectedNode,
      hostBlockchain: this.hostBlockchain,
      hostProvider: this.hostProvider,
      hostTokenDecimals: decimals
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
        if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()

        const decimals = await this._getDecimals()
        const contractAddress = await this._getContractAddress()

        let hostTxReceiptId = null

        // NOTE redeem from eth
        if (this.hostBlockchain === 'eth') {
          const hostTxReceipt = await eth.makeContractSend(
            this.hostProvider,
            'redeem',
            {
              isWeb3Injected: this._isHostProviderInjected,
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
          const eosPublicKeys = await eos.getAvailablePublicKeys(
            eos.getApi(
              this.hostPrivateKey,
              'https://ptoken-eos.provable.xyz:443',
              null
            )
          )
          const eosAccountName = await eos.getAccountName(
            eos.getApi(null, 'https://ptoken-eos.provable.xyz:443', null),
            eosPublicKeys
          )

          this.hostProvider.cachedAbis.set(contractAddress, {
            abi: peosAbi,
            rawAbi: null
          })

          const hostTxReceipt = await this.hostProvider.transact(
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

        const broadcastedBtcTxReport = await this.nodeSelector.selectedNode.monitorIncomingTransaction(
          hostTxReceiptId,
          promiEvent.eventEmitter
        )

        const broadcastedBtcTx = await btc.waitForTransactionConfirmation(
          this._btcNetwork,
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
      if (!this.nodeSelector.selectedNode) await this.nodeSelector.select()
      const info = await this.nodeSelector.selectedNode.getInfo()
      this.contractAddress = info.smart_contract_address
    }

    return this.contractAddress
  }

  async _getDecimals() {
    if (!this.decimals) {
      if (this.hostBlockchain === 'eth') {
        this.decimals = await eth.makeContractCall(
          this.hostProvider,
          'decimals',
          {
            isWeb3Injected: this._isHostProviderInjected,
            abi: pbtcAbi,
            contractAddress: this._getContractAddress()
          }
        )
      }
      if (this.hostBlockchain === 'eos') {
        this.decimals = 8
      }
    }
    return this.decimals
  }
}
