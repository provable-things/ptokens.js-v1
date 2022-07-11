import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { abi, constants, eth, eos, helpers, redeemFrom } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3Utils from 'web3-utils'
import minimumAmounts from './minimum-amounts'

export class pEosioToken extends NodeSelector {
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      constants.blockchains.Eosio
    )

    super({
      pToken: _configs.pToken,
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultNode: _configs.defaultNode
    })

    const {
      ethPrivateKey,
      ethProvider,
      bscPrivateKey,
      bscProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider,
      telosPrivateKey,
      telosRpc,
      telosSignatureProvider,
      orePrivateKey,
      oreRpc,
      oreSignatureProvider
    } = _configs

    if (eosSignatureProvider) {
      this.nativeApi = eos.getApi(null, eosRpc, eosSignatureProvider)
    } else if (eosPrivateKey && eosRpc) {
      this.nativeApi = eos.getApi(eosPrivateKey, eosRpc, null)
      this.nativePrivateKey = eosPrivateKey
    } else if (!eosSignatureProvider && !eosPrivateKey && eosRpc) {
      this.nativeApi = eos.getApi(null, eosRpc, null)
    }

    if (telosSignatureProvider) {
      this.nativeApi = eos.getApi(null, telosRpc, telosSignatureProvider)
    } else if (telosPrivateKey && telosRpc) {
      this.nativeApi = eos.getApi(telosPrivateKey, telosRpc, null)
      this.nativePrivateKey = telosPrivateKey
    } else if (!telosSignatureProvider && !telosPrivateKey && telosRpc) {
      this.nativeApi = eos.getApi(null, telosRpc, null)
    }

    if (oreSignatureProvider) {
      this.nativeApi = eos.getApi(null, oreRpc, oreSignatureProvider)
    } else if (orePrivateKey && oreRpc) {
      this.nativeApi = eos.getApi(orePrivateKey, oreRpc, null)
      this.nativePrivateKey = orePrivateKey
    } else if (!oreSignatureProvider && !orePrivateKey && oreRpc) {
      this.nativeApi = eos.getApi(null, oreRpc, null)
    }

    if (ethProvider) this.hostApi = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    if (bscProvider) this.hostApi = new Web3(bscProvider)
    if (bscPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(bscPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(bscPrivateKey)
    } else {
      this.hostPrivateKey = null
    }
  }
  /**
   * @param {String} _amount in wei
   * @param {String} _hostAccount
   * @param {IssueOptions} _options
   */
  issue(_amount, _hostAccount, _options) {
    const promiEvent = Web3PromiEvent()
    const start = async () => {
      try {
        const { blocksBehind, expireSeconds, permission, actor } = _options

        await this._loadData()

        if (BigNumber(_amount).isLessThan(minimumAmounts[this.pToken.toLowerCase()].issue)) {
          promiEvent.reject(`Impossible to issue less than ${minimumAmounts[this.pToken.toLowerCase()].issue}`)
          return
        }

        if (
          (this.hostBlockchain === constants.blockchains.Ethereum ||
            this.hostBlockchain === constants.blockchains.BinanceSmartChain) &&
          !Web3Utils.isAddress(_hostAccount)
        ) {
          promiEvent.reject('Invalid host account')
          return
        }

        if (!this.selectedNode) await this.select()

        this.nativeApi.cachedAbis.set(this.nativeContractAddress, {
          abi: abi.EosioToken,
          rawAbi: null
        })

        const nativeTxReceipt = await this.nativeApi.transact(
          {
            actions: [
              {
                account: this.nativeContractAddress,
                name: 'transfer',
                authorization: [
                  {
                    actor,
                    permission
                  }
                ],
                data: {
                  from: actor,
                  to: this.nativeVaultAddress,
                  quantity: eos.getAmountInEosFormat(
                    _amount,
                    this.pToken === constants.pTokens.IQ ? 3 : 4,
                    this.pToken === constants.pTokens.IQ ||
                      this.pToken === constants.pTokens.TLOS ||
                      this.pToken === constants.pTokens.EFX
                      ? this.pToken.toUpperCase()
                      : this.pToken.slice(1).toUpperCase()
                  ),
                  memo: _hostAccount
                }
              }
            ]
          },
          {
            blocksBehind,
            expireSeconds
          }
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', nativeTxReceipt)

        const { broadcast_tx_hash } = await this.selectedNode.monitorIncomingTransaction(
          nativeTxReceipt.transaction_id,
          promiEvent.eventEmitter
        )

        const hostTxReceipt = await eth.waitForTransactionConfirmation(this.hostApi, broadcast_tx_hash)
        promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)

        promiEvent.resolve({
          to: _hostAccount,
          nativeTx: nativeTxReceipt.transaction_id,
          hostTx: broadcast_tx_hash,
          amount: _amount
        })
      } catch (_err) {
        promiEvent.reject(_err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  /**
   *
   * @param {string|BigNumber|BN} _amount
   * @param {string} _account
   *  @param {string} _metadata
   * @param {RedeemOptions} _options
   */
  redeemWithMetadata(_amount, _account, _metadata, _options = {}) {
    return this._redeem(_amount, _account, _metadata, _options)
  }

  /**
   *
   * @param {string|BigNumber|BN} _amount
   * @param {string} _account
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _account, _options = {}) {
    return this._redeem(_amount, _account, null, _options)
  }

  /**
   *
   * @param {string|BigNumber|BN} _amount
   * @param {string} _account
   *  @param {string} _metadata
   * @param {RedeemOptions} _options
   */
  _redeem(_amount, _account, _metadata, _options = {}) {
    const promiEvent = Web3PromiEvent()
    const { gas, gasPrice } = _options

    const start = async () => {
      try {
        await this._loadData()

        if (BigNumber(_amount).isLessThan(minimumAmounts[this.pToken.toLowerCase()].redeem)) {
          promiEvent.reject(`Impossible to redeem less than ${minimumAmounts[this.pToken.toLowerCase()].redeem}`)
          return
        }

        if (!eos.isValidAccountName(_account)) {
          promiEvent.reject('Invalid native account')
          return
        }

        let hostTxHash = null
        if (
          this.hostBlockchain === constants.blockchains.Ethereum ||
          this.hostBlockchain === constants.blockchains.Polygon ||
          this.hostBlockchain === constants.blockchains.BinanceSmartChain
        ) {
          const hostTxReceipt = await redeemFrom.redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress: this.hostContractAddress,
              value: 0
            },
            _metadata ? [_amount, _metadata, _account] : [_amount, _account],
            promiEvent,
            'hostTxBroadcasted'
          )
          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.transactionHash
        }

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(hostTxHash, promiEvent.eventEmitter)

        const nativeTxReceipt = await eos.waitForTransactionConfirmation(
          this.nativeApi,
          incomingTxReport.broadcast_tx_hash
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', nativeTxReceipt)

        promiEvent.resolve({
          to: _account,
          nativeTx: nativeTxReceipt.transaction_id,
          hostTx: hostTxHash,
          amount: BigNumber(_amount).toFixed()
        })
      } catch (_err) {
        promiEvent.reject(_err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  async _loadData() {
    try {
      if (!this.selectedNode) await this.select()
      if (!this.nativeContractAddress || !this.hostContractAddress) {
        const {
          native_smart_contract_address,
          host_smart_contract_address,
          native_vault_address
        } = await this.selectedNode.getInfo()
        this.nativeVaultAddress = native_vault_address
        this.nativeContractAddress = native_smart_contract_address
        this.hostContractAddress =
          this.hostBlockchain === constants.blockchains.Ethereum
            ? eth.addHexPrefix(host_smart_contract_address)
            : host_smart_contract_address
      }

      return this.nativeContractAddress
    } catch (_err) {
      throw new Error(`Error during loading data: ${_err.message}`)
    }
  }
}
