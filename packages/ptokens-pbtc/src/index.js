import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, eth, eos, btc, helpers, redeemFrom } from 'ptokens-utils'
import { DepositAddress } from 'ptokens-deposit-address'
import Web3Utils from 'web3-utils'
import BigNumber from 'bignumber.js'

const MINIMUM_BTC_REDEEMABLE = 0.00005

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
      const account = this.hostApi.eth.accounts.privateKeyToAccount(
        eth.addHexPrefix(ethPrivateKey)
      )

      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
    } else {
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

    const depositAddress = new DepositAddress({
      node: selectedNode,
      nativeBlockchain: this.nativeBlockchain,
      nativeNetwork: this.nativeNetwork,
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
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _btcAddress, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { gas, gasPrice } = _options

        if (_amount < MINIMUM_BTC_REDEEMABLE) {
          // prettier-ignore
          promiEvent.reject(`Impossible to burn less than ${MINIMUM_BTC_REDEEMABLE} pBTC`)
          return
        }

        if (!btc.isValidAddress(_btcAddress)) {
          promiEvent.reject('Invalid Bitcoin address')
          return
        }

        if (!this.selectedNode) await this.select()

        // prettier-ignore
        const decimals = this.hostBlockchain === constants.blockchains.Ethereum ? 18 : 8
        const contractAddress = await this._getContractAddress()

        const { redeemFromEthereum, redeemFromEosio } = redeemFrom

        let hostTxHash = null
        if (this.hostBlockchain === constants.blockchains.Ethereum) {
          const ethTxReceipt = await redeemFromEthereum(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress,
              value: 0
            },
            [
              eth.onChainFormat(new BigNumber(_amount), decimals).toFixed(),
              _btcAddress
            ],
            promiEvent,
            'nativeTxBroadcasted'
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
            _btcAddress,
            decimals,
            contractAddress,
            constants.pTokens.pBTC
          )

          // NOTE: 'onEosTxConfirmed' will be removed in version >= 1.0.0
          promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt)
          promiEvent.eventEmitter.emit('hostTxConfirmed', eosTxReceipt)
          hostTxHash = eosTxReceipt.transaction_id
        }

        const broadcastedBtcTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxHash,
          promiEvent.eventEmitter
        )

        const broadcastedBtcTxReceipt = await btc.waitForTransactionConfirmation(
          this.nativeNetwork,
          broadcastedBtcTxReport.broadcast_tx_hash,
          5000
        )
        // NOTE: 'onBtcTxConfirmed' will be removed in version >= 1.0.0
        // prettier-ignore
        promiEvent.eventEmitter.emit('onBtcTxConfirmed', broadcastedBtcTxReceipt)
        // prettier-ignore
        promiEvent.eventEmitter.emit('nativeTxConfirmed', broadcastedBtcTxReceipt)

        promiEvent.resolve({
          amount: _amount.toFixed(decimals),
          hostTx: hostTxHash,
          nativeTx: broadcastedBtcTxReport.broadcast_tx_hash,
          to: _btcAddress
        })
      } catch (err) {
        promiEvent.reject(err)
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
