import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, algo, eth, eos, btc, helpers, redeemFrom } from 'ptokens-utils'
import { DepositAddress } from 'ptokens-deposit-address'
import Web3Utils from 'web3-utils'

const MINIMUM_BTC_REDEEMABLE = 0.00005

export class pBTC extends NodeSelector {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      _configs.nativeBlockchain || constants.blockchains.Bitcoin
    )

    super({
      pToken: _configs.pToken || constants.pTokens.pBTC,
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultNode: _configs.defaultNode
    })

    const {
      ethPrivateKey,
      ethProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider,
      algoProvider,
      algoClient
    } = _configs

    if ((ethProvider || ethPrivateKey) && (eosSignatureProvider || eosPrivateKey))
      throw new Error('Bad Initialization. Impossible to use both ETH and EOS')

    // NOTE: parse eth params
    if (ethProvider) this.hostApi = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
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

    if (algoProvider) this.hostApi = algoProvider
    if (algoClient) this.algoClient = algoClient

    this.contractAddress = null
    this.decimals = null
  }

  /**
   * @param {String} _hostAddress
   */
  async getDepositAddress(_hostAddress) {
    const isValidAddress = {
      [constants.blockchains.Ethereum]: _address => Web3Utils.isAddress(_address),
      [constants.blockchains.BinanceSmartChain]: _address => Web3Utils.isAddress(_address),
      [constants.blockchains.Xdai]: _address => Web3Utils.isAddress(_address),
      [constants.blockchains.Polygon]: _address => Web3Utils.isAddress(_address),
      [constants.blockchains.Arbitrum]: _address => Web3Utils.isAddress(_address),
      [constants.blockchains.Eosio]: _address => eos.isValidAccountName(_address),
      [constants.blockchains.Telos]: _address => eos.isValidAccountName(_address),
      [constants.blockchains.Algorand]: _address => algo.isValidAddress(_address),
      [constants.blockchains.Phoenix]: _address => eos.isValidAccountName(_address)
    }
    if (!isValidAddress[this.hostBlockchain](_hostAddress)) throw new Error('Invalid host account')

    const selectedNode = this.selectedNode ? this.selectedNode : await this.select()
    if (!selectedNode) throw new Error('No node selected. Impossible to generate a deposit Address.')

    const depositAddress = new DepositAddress({
      node: selectedNode,
      nativeBlockchain: this.nativeBlockchain,
      nativeNetwork: this.nativeNetwork,
      hostBlockchain: this.hostBlockchain,
      hostNetwork: this.hostNetwork,
      hostApi: this.hostApi
    })

    await depositAddress.generate(_hostAddress)

    // if (!depositAddress.verify()) throw new Error('Node deposit address does not match expected address')

    return depositAddress
  }

  /**
   * @param {Number|BigNumber|String} _amount
   * @param {String} _btcAddress
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _btcAddress, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { gas, gasPrice, blocksBehind, expireSeconds, permission, actor, from, swapInfo } = _options

        await this._loadData()

        if (_amount < MINIMUM_BTC_REDEEMABLE) {
          promiEvent.reject(`Impossible to burn less than ${MINIMUM_BTC_REDEEMABLE} pBTC`)
          return
        }

        if (this.pToken === constants.pTokens.pBTC) {
          if (!btc.isValidAddress(_btcAddress)) {
            promiEvent.reject('Invalid Bitcoin address')
            return
          }
        }

        if (!this.selectedNode) await this.select()

        const { redeemFromEvmCompatible, redeemFromEosio, redeemFromAlgorand } = redeemFrom

        const destinationChainId =
          this.version === 'v2' ? constants.chainIds[this.nativeBlockchain][this.nativeNetwork] : null

        let hostTxHash = null
        if (
          this.hostBlockchain === constants.blockchains.Ethereum ||
          this.hostBlockchain === constants.blockchains.BinanceSmartChain ||
          this.hostBlockchain === constants.blockchains.Xdai ||
          this.hostBlockchain === constants.blockchains.Polygon ||
          this.hostBlockchain === constants.blockchains.Arbitrum
        ) {
          const hostTxReceipt = await redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress: this.contractAddress,
              value: 0
            },
            this.version === 'v1' ? [_amount, _btcAddress] : [_amount, _btcAddress, destinationChainId],
            promiEvent,
            'hostTxBroadcasted',
            this.version || 'v1'
          )
          // NOTE: 'onEthTxConfirmed' will be removed in version >= 1.0.0
          if (this.hostBlockchain === constants.blockchains.Ethereum)
            promiEvent.eventEmitter.emit('onEthTxConfirmed', hostTxReceipt)

          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.transactionHash
        }

        if (
          this.hostBlockchain === constants.blockchains.Eosio ||
          this.hostBlockchain === constants.blockchains.Telos ||
          this.hostBlockchain === constants.blockchains.Phoenix
        ) {
          const eosTxReceipt = await redeemFromEosio(
            this.hostApi,
            _amount,
            _btcAddress,
            this.version === 'v2' ? 9 : 8,
            this.contractAddress,
            constants.pTokens.pBTC,
            {
              blocksBehind,
              expireSeconds,
              permission,
              actor,
              version: this.version,
              destinationChainId: destinationChainId
            }
          )

          if (this.hostBlockchain === constants.blockchains.Eosio) {
            // NOTE: 'onEosTxConfirmed' will be removed in version >= 1.0.0
            promiEvent.eventEmitter.emit('onEosTxConfirmed', eosTxReceipt)
          }
          promiEvent.eventEmitter.emit('hostTxConfirmed', eosTxReceipt)
          hostTxHash = eosTxReceipt.transaction_id
        }

        if (this.hostBlockchain === constants.blockchains.Algorand) {
          const hostTxReceipt = await redeemFromAlgorand({
            provider: this.hostApi,
            client: this.algoClient,
            amount: _amount,
            to: this.hostIdentity,
            assetIndex: this.contractAddress,
            nativeAccount: _btcAddress,
            from,
            destinationChainId,
            eventEmitter: promiEvent.eventEmitter,
            swapInfo
          })
          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.txID().toString()
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
        promiEvent.eventEmitter.emit('onBtcTxConfirmed', broadcastedBtcTxReceipt)
        promiEvent.eventEmitter.emit('nativeTxConfirmed', broadcastedBtcTxReceipt)

        promiEvent.resolve({
          amount: _amount,
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

  async _loadData() {
    try {
      if (!this.contractAddress) {
        if (!this.selectedNode) await this.select()
        const {
          host_identity,
          smart_contract_address,
          host_smart_contract_address,
          versions
        } = await this.selectedNode.getInfo()
        this.contractAddress = smart_contract_address || host_smart_contract_address
        this.version = versions && versions.network ? versions.network : 'v1'
        this.hostIdentity = host_identity
      }
    } catch (_err) {
      throw new Error(`Error during getting contract address: ${_err.message}`)
    }
  }
}
