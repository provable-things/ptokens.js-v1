import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, eth, eos, ltc, helpers, redeemFrom } from 'ptokens-utils'
import { DepositAddress } from 'ptokens-deposit-address'
import Web3Utils from 'web3-utils'

const MINIMUM_LTC_REDEEMABLE = 0.00005

export class pLTC extends NodeSelector {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      constants.blockchains.Litecoin
    )

    super({
      pToken: constants.pTokens.pLTC,
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultNode: _configs.defaultNode
    })

    const { ethPrivateKey, ethProvider, eosPrivateKey, eosRpc, eosSignatureProvider } = _configs

    if (ethProvider) this.hostApi = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))

      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
    } else {
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
    if (this.hostBlockchain === constants.blockchains.Ethereum && !Web3Utils.isAddress(_hostAddress))
      throw new Error('Invalid Ethereum Address')

    const selectedNode = this.selectedNode ? this.selectedNode : await this.select()
    if (!selectedNode) throw new Error('No node selected. Impossible to generate a BTC deposit Address.')

    const depositAddress = new DepositAddress({
      node: selectedNode,
      nativeBlockchain: this.nativeBlockchain,
      nativeNetwork: this.nativeNetwork,
      hostBlockchain: this.hostBlockchain,
      hostNetwork: this.hostNetwork,
      hostApi: this.hostApi
    })

    await depositAddress.generate(_hostAddress)

    if (!depositAddress.verify()) throw new Error('Node deposit address does not match expected address')

    return depositAddress
  }

  /**
   * @param {Number|String|BigNumber} _amount
   * @param {String} _ltcAddress
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _ltcAddress, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { gas, gasPrice, blocksBehind, expireSeconds, permission } = _options

        if (_amount < MINIMUM_LTC_REDEEMABLE) {
          promiEvent.reject(`Impossible to burn less than ${MINIMUM_LTC_REDEEMABLE} pLTC`)
          return
        }

        if (!ltc.isValidAddress(_ltcAddress)) {
          promiEvent.reject('Invalid Litecoin Address')
          return
        }

        if (!this.selectedNode) await this.select()

        const contractAddress = await this._getContractAddress()

        const { redeemFromEvmCompatible, redeemFromEosio } = redeemFrom
        let hostTxHash = null

        if (this.hostBlockchain === constants.blockchains.Ethereum) {
          const ethTxReceipt = await redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress,
              value: 0
            },
            [_amount, _ltcAddress],
            promiEvent,
            'hostTxBroadcasted'
          )
          // NOTE: 'onEthTxConfirmed' will be removed in version >= 1.0.0
          promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)
          promiEvent.eventEmitter.emit('hostTxConfirmed', ethTxReceipt)
          hostTxHash = ethTxReceipt.transactionHash
        }

        if (this.hostBlockchain === constants.blockchains.Eosio) {
          const eosTxReceipt = await redeemFromEosio(
            this.hostApi,
            _amount,
            _ltcAddress,
            8,
            contractAddress,
            constants.pTokens.pLTC,
            {
              blocksBehind,
              expireSeconds,
              permission
            }
          )

          // NOTE: 'onEosTxConfirmed' will be removed in version > 1.0.0
          promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt)
          promiEvent.eventEmitter.emit('hostTxConfirmed', eosTxReceipt)
          hostTxHash = eosTxReceipt.transaction_id
        }

        const broadcastedLtcTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxHash,
          promiEvent.eventEmitter
        )

        const broadcastedLtcTxReceipt = await ltc.waitForTransactionConfirmation(
          this.nativeNetwork,
          broadcastedLtcTxReport.broadcast_tx_hash,
          3000
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', broadcastedLtcTxReceipt)
        promiEvent.eventEmitter.emit('onLtcTxConfirmed', broadcastedLtcTxReceipt)

        promiEvent.resolve({
          amount: _amount,
          hostTx: hostTxHash,
          nativeTx: broadcastedLtcTxReport.broadcast_tx_hash,
          to: _ltcAddress
        })
      } catch (_err) {
        promiEvent.reject(_err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  async _getContractAddress() {
    try {
      if (!this.contractAddress) {
        if (!this.selectedNode) await this.select()

        const { smart_contract_address } = await this.selectedNode.getInfo()
        this.contractAddress = smart_contract_address
      }

      return this.contractAddress
    } catch (_err) {
      throw new Error(`Error during getting contract address: ${_err.message}`)
    }
  }
}
