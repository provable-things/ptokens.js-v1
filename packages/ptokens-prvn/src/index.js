import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, eth, rvn, helpers, redeemFrom } from 'ptokens-utils'
import { DepositAddress } from 'ptokens-deposit-address'
import Web3Utils from 'web3-utils'

const MINIMUM_RVN_REDEEMABLE = 0.00005

export class pRVN extends NodeSelector {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      constants.blockchains.Ravencoin
    )

    super({
      pToken: constants.pTokens.pRVN,
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultNode: _configs.defaultNode
    })

    const { bscPrivateKey, bscProvider } = _configs

    if (bscProvider) this.hostApi = new Web3(bscProvider)
    if (bscPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(bscPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(bscPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    this.contractAddress = null
    this.decimals = null
  }

  /**
   * @param {String} _hostAddress
   */
  async getDepositAddress(_hostAddress) {
    if (this.hostBlockchain === constants.blockchains.BinanceSmartChain && !Web3Utils.isAddress(_hostAddress))
      throw new Error('Invalid Binance Smart Chain Address')

    const selectedNode = this.selectedNode ? this.selectedNode : await this.select()
    if (!selectedNode) throw new Error('No node selected. Impossible to generate a RVN deposit Address.')

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
   * @param {String} _rvnAddress
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _rvnAddress, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { gas, gasPrice } = _options

        if (_amount < MINIMUM_RVN_REDEEMABLE) {
          promiEvent.reject(`Impossible to burn less than ${MINIMUM_RVN_REDEEMABLE} pRVN`)
          return
        }

        if (!rvn.isValidAddress(_rvnAddress)) {
          promiEvent.reject('Invalid Ravecoin Address')
          return
        }

        if (!this.selectedNode) await this.select()
        const contractAddress = await this._getContractAddress()

        const { redeemFromEvmCompatible } = redeemFrom
        let hostTxHash = null

        if (this.hostBlockchain === constants.blockchains.BinanceSmartChain) {
          const bscTxReceipt = await redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress,
              value: 0
            },
            [_amount, _rvnAddress],
            promiEvent,
            'hostTxBroadcasted'
          )
          promiEvent.eventEmitter.emit('hostTxConfirmed', bscTxReceipt)
          hostTxHash = bscTxReceipt.transactionHash
        }

        const broadcastedRvnTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxHash,
          promiEvent.eventEmitter
        )

        const broadcastedRvnTxReceipt = await rvn.waitForTransactionConfirmation(
          this.nativeNetwork,
          broadcastedRvnTxReport.broadcast_tx_hash
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', broadcastedRvnTxReceipt)

        promiEvent.resolve({
          amount: _amount,
          hostTx: hostTxHash,
          nativeTx: broadcastedRvnTxReport.broadcast_tx_hash,
          to: _rvnAddress
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
