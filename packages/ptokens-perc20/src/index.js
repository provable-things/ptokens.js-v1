import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { abi, algo, constants, eth, eos, helpers, redeemFrom } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3Utils from 'web3-utils'
import minimumAmounts from './minimum-amounts'
import mapDecimals from './decimals'

export class pERC20 extends NodeSelector {
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      _configs.nativeBlockchain || constants.blockchains.Ethereum
    )

    super({
      pToken: _configs.pToken.toLowerCase() === constants.pTokens.pETH ? 'pweth' : _configs.pToken,
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
      xdaiPrivateKey,
      xdaiProvider,
      polygonPrivateKey,
      polygonProvider,
      eosPrivateKey,
      eosRpc,
      eosSignatureProvider,
      telosPrivateKey,
      telosRpc,
      telosSignatureProvider,
      ultraPrivateKey,
      ultraRpc,
      ultraSignatureProvider,
      arbitrumPrivateKey,
      arbitrumProvider,
      luxochainPrivateKey,
      luxochainProvider,
      algoSignatureProvider,
      algoClient,
      ftmPrivateKey,
      ftmProvider
    } = _configs

    if (ftmProvider) this.web3 = new Web3(ftmProvider)
    if (ftmPrivateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ftmPrivateKey))
      this.web3.eth.defaultAccount = account.address
      this.nativePrivateKey = eth.addHexPrefix(ftmPrivateKey)
    } else {
      this.nativePrivateKey = null
    }

    // if fantom is used as native chain, then eth can be used just as host
    if (nativeBlockchain === constants.blockchains.Fantom && (ethProvider || ethPrivateKey)) {
      if (ethProvider) this.hostApi = new Web3(ethProvider)
      if (ethPrivateKey) {
        const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
        this.hostApi.eth.defaultAccount = account.address
        this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
      } else {
        this.hostPrivateKey = null
      }
    } else if (ethProvider || ethPrivateKey) {
      if (ethProvider) this.web3 = new Web3(ethProvider)
      if (ethPrivateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
        this.web3.eth.defaultAccount = account.address
        this.nativePrivateKey = eth.addHexPrefix(ethPrivateKey)
      } else {
        this.nativePrivateKey = null
      }
    }

    if (bscProvider) this.hostApi = new Web3(bscProvider)
    if (bscPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(bscPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(bscPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    if (xdaiProvider) this.hostApi = new Web3(xdaiProvider)
    if (xdaiPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(xdaiPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(xdaiPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    if (polygonProvider) this.hostApi = new Web3(polygonProvider)
    if (polygonPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(polygonPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(polygonPrivateKey)
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

    if (telosSignatureProvider) {
      this.hostApi = eos.getApi(null, telosRpc, telosSignatureProvider)
    } else if (telosPrivateKey && telosRpc) {
      this.hostApi = eos.getApi(telosPrivateKey, telosRpc, null)
      this.hostPrivateKey = telosPrivateKey
    } else if (!telosSignatureProvider && !telosPrivateKey && telosRpc) {
      this.hostApi = eos.getApi(null, telosRpc, null)
    }

    if (ultraSignatureProvider) {
      this.hostApi = eos.getApi(null, ultraRpc, ultraSignatureProvider)
    } else if (ultraPrivateKey && ultraRpc) {
      this.hostApi = eos.getApi(ultraPrivateKey, ultraRpc, null)
      this.hostPrivateKey = ultraPrivateKey
    } else if (!ultraSignatureProvider && !ultraPrivateKey && ultraRpc) {
      this.hostApi = eos.getApi(null, ultraRpc, null)
    }

    if (arbitrumProvider) this.hostApi = new Web3(arbitrumProvider)
    if (arbitrumPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(arbitrumPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(arbitrumPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    if (luxochainProvider) this.hostApi = new Web3(luxochainProvider)
    if (luxochainPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(luxochainPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(luxochainPrivateKey)
    } else {
      this.hostPrivateKey = null
    }

    // the objects used to sign returned by WalletConnect or AlgoSigner
    // it's not compatible with algosdk so ptokens.js expects an object called
    // algoSignatureProvider which has a function called sign.
    if (algoSignatureProvider) this.hostApi = algoSignatureProvider
    if (algoClient) this.hostApi = { ...this.hostApi, ...algoClient }

    this._peginEth =
      _configs.pToken.toLowerCase() === constants.pTokens.pETH ||
      _configs.pToken.toLowerCase() === constants.pTokens.pFTM
  }

  /**
   * @param {String|BigNumber|BN} _amount in wei
   * @param {String} _hostAccount
   * @param {IssueOptions} _options
   */
  issue(_amount, _hostAccount, _options = {}) {
    return this._issue(_amount, _hostAccount, null, _options)
  }

  /**
   * @param {String|BigNumber|BN} _amount in wei
   * @param {String} _hostAccount
   * @param {String} _metadata
   * @param {IssueOptions} _options
   */
  issueWithMetadata(_amount, _hostAccount, _metadata, _options = {}) {
    return this._issue(_amount, _hostAccount, _metadata, _options)
  }

  /**
   * @param {String|BigNumber|BN} _amount in wei
   * @param {String} _hostAccount
   * @param {String} _metadata
   * @param {IssueOptions} _options
   */
  _issue(_amount, _hostAccount, _metadata, _options = {}) {
    const promiEvent = Web3PromiEvent()
    const start = async () => {
      try {
        const { gas, gasPrice } = _options
        const { blockchains } = constants
        await this._loadData()

        const minimumAmount = minimumAmounts[this.pToken.toLowerCase()].issue
        if (BigNumber(_amount).isLessThan(minimumAmount)) {
          promiEvent.reject(`Impossible to issue less than ${minimumAmount}`)
          return
        }

        const isValidAddress = {
          [constants.blockchains.Ethereum]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.BinanceSmartChain]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.Xdai]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.Polygon]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.Arbitrum]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.Luxochain]: _address => Web3Utils.isAddress(_address),
          [constants.blockchains.Eosio]: _address => eos.isValidAccountName(_address),
          [constants.blockchains.Telos]: _address => eos.isValidAccountName(_address),
          [constants.blockchains.Ultra]: _address => eos.isValidAccountName(_address),
          [constants.blockchains.Algorand]: _address => algo.isValidAddress(_address)
        }
        if (!isValidAddress[this.hostBlockchain](_hostAccount)) {
          promiEvent.reject('Invalid host account')
          return
        }

        if (!this.selectedNode) await this.select()

        const destinationChainId =
          this.version === 'v2' ? constants.chainIds[this.hostBlockchain][this.hostNetwork] : null

        let ethTxHash = null
        const waitForEthTransaction = () =>
          new Promise((_resolve, _reject) => {
            eth[this.nativePrivateKey ? 'sendSignedMethodTx' : 'makeContractSend'](
              this.web3,
              this._peginEth ? 'pegInEth' : 'pegIn',
              {
                privateKey: this.nativePrivateKey,
                abi: this.version === 'v1' ? abi.pERC20Vault : abi.pERC20VaultV2,
                gas,
                gasPrice,
                contractAddress: eth.addHexPrefix(this.nativeVaultAddress),
                value: this._peginEth ? _amount : 0
              },
              this.version === 'v1'
                ? _metadata
                  ? this._peginEth
                    ? [_hostAccount, _metadata]
                    : [_amount, this.nativeContractAddress, _hostAccount, _metadata]
                  : this._peginEth
                    ? [_hostAccount]
                    : [_amount, this.nativeContractAddress, _hostAccount]
                : _metadata
                  ? this._peginEth
                    ? [_hostAccount, destinationChainId, _metadata]
                    : [_amount, this.nativeContractAddress, _hostAccount, _metadata, destinationChainId]
                  : this._peginEth
                    ? [_hostAccount, destinationChainId]
                    : [_amount, this.nativeContractAddress, _hostAccount, destinationChainId]
            )
              .once('transactionHash', _hash => {
                ethTxHash = _hash
                promiEvent.eventEmitter.emit('nativeTxBroadcasted', ethTxHash)
              })
              .once('receipt', _resolve)
              .once('error', _reject)
          })
        const ethTxReceipt = await waitForEthTransaction()
        promiEvent.eventEmitter.emit('nativeTxConfirmed', ethTxReceipt)

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(ethTxHash, promiEvent.eventEmitter)

        let hostTxReceipt
        if (this.hostBlockchain === blockchains.Eosio || this.hostBlockchain === blockchains.Telos)
          hostTxReceipt = await eos.waitForTransactionConfirmation(this.hostApi, incomingTxReport.broadcast_tx_hash)

        if (
          this.hostBlockchain === blockchains.Xdai ||
          this.hostBlockchain === blockchains.BinanceSmartChain ||
          this.hostBlockchain === blockchains.Polygon ||
          this.hostBlockchain === blockchains.Arbitrum ||
          this.hostBlockchain === blockchains.Luxochain ||
          this.hostBlockchain === blockchains.Ethereum
        )
          hostTxReceipt = await eth.waitForTransactionConfirmation(this.hostApi, incomingTxReport.broadcast_tx_hash)

        if (this.hostBlockchain === blockchains.Algorand)
          hostTxReceipt = await algo.waitForTransactionConfirmation(this.hostApi, incomingTxReport.broadcast_tx_hash)

        promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
        promiEvent.resolve({
          to: _hostAccount,
          nativeTx: ethTxHash,
          hostTx: incomingTxReport.broadcast_tx_hash,
          amount: BigNumber(_amount).toFixed()
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
   * @param {string|number} _amount
   * @param {string} _nativeAccount
   * @param {Options} _options
   */
  redeem(_amount, _nativeAccount, _options = {}) {
    return this._redeem(_amount, _nativeAccount, null, _options)
  }

  /**
   * @param {String|BigNumber|BN} _amount in wei
   * @param {String} _nativeAccount
   * @param {String} _metadata
   * @param {IssueOptions} _options
   */
  redeemWithMetadata(_amount, _nativeAccount, _metadata, _options = {}) {
    return this._redeem(_amount, _nativeAccount, _metadata, _options)
  }

  /**
   *
   * @param {string|number} _amount
   * @param {string} _nativeAccount
   * @param {string} _metadata
   * @param {Options} _options
   */
  _redeem(_amount, _nativeAccount, _metadata, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { blocksBehind, expireSeconds, permission, gas, gasPrice, actor } = _options
        const { blockchains, pTokens } = constants

        await this._loadData()

        const minimumAmount = minimumAmounts[this.pToken.toLowerCase()].redeem[this.hostBlockchain]
        if (BigNumber(_amount).isLessThan(minimumAmount)) {
          promiEvent.reject(`Impossible to redeem less than ${minimumAmount}`)
          return
        }

        if (this.nativeBlockchain === blockchains.Ethereum && !Web3Utils.isAddress(_nativeAccount)) {
          promiEvent.reject('Invalid native account')
          return
        }

        if (!this.selectedNode) await this.select()

        const { redeemFromEosio, redeemFromEvmCompatible, redeemFromAlgorand } = redeemFrom

        const destinationChainId =
          this.version === 'v2' ? constants.chainIds[this.nativeBlockchain][this.nativeNetwork] : null

        let hostTxHash
        if (
          this.hostBlockchain === blockchains.BinanceSmartChain ||
          this.hostBlockchain === blockchains.Xdai ||
          this.hostBlockchain === blockchains.Polygon ||
          this.hostBlockchain === blockchains.Arbitrum ||
          this.hostBlockchain === blockchains.Luxochain ||
          this.hostBlockchain === blockchains.Ethereum
        ) {
          const hostTxReceipt = await redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress: this.hostContractAddress,
              value: 0
            },
            this.version === 'v1'
              ? _metadata
                ? [_amount, _metadata, _nativeAccount]
                : [_amount, _nativeAccount]
              : _metadata
                ? [_amount, _metadata, _nativeAccount, destinationChainId]
                : [_amount, _nativeAccount, destinationChainId],
            promiEvent,
            'hostTxBroadcasted',
            this.version || 'v1'
          )

          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.transactionHash
        }

        if (
          this.hostBlockchain === blockchains.Eosio ||
          this.hostBlockchain === blockchains.Telos ||
          this.hostBlockchain === blockchains.Ultra
        ) {
          const hostTxReceipt = await redeemFromEosio(
            this.hostApi,
            _amount,
            _nativeAccount,
            mapDecimals[this.pToken.toLowerCase()]
              ? mapDecimals[this.pToken.toLowerCase()][this.hostBlockchain][this.hostNetwork]
              : 9,
            this.hostContractAddress,
            this.pToken === pTokens.pWETH ? 'peth' : this.pToken,
            { blocksBehind, expireSeconds, permission, actor, destinationChainId, version: this.version }
          )

          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.transaction_id
        }

        if (this.hostBlockchain === blockchains.Algorand) {
          const hostTxReceipt = await redeemFromAlgorand(
            this.hostApi,
            _amount,
            _nativeAccount
            // todo here
          )
          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.txId
        }

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(hostTxHash, promiEvent.eventEmitter)
        const nativeTxReceipt = await eth.waitForTransactionConfirmation(this.web3, incomingTxReport.broadcast_tx_hash)
        promiEvent.eventEmitter.emit('nativeTxConfirmed', nativeTxReceipt)

        promiEvent.resolve({
          to: _nativeAccount,
          nativeTx: nativeTxReceipt.transactionHash,
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
          native_vault_address,
          versions
        } = await this.selectedNode.getInfo()
        this.nativeContractAddress = eth.addHexPrefix(native_smart_contract_address)
        this.hostContractAddress =
          this.hostBlockchain === constants.blockchains.Eosio ||
          this.hostBlockchain === constants.blockchains.Telos ||
          this.hostBlockchain === constants.blockchains.Ultra
            ? host_smart_contract_address
            : eth.addHexPrefix(host_smart_contract_address)
        this.nativeVaultAddress = native_vault_address ? eth.addHexPrefix(native_vault_address) : null
        this.version = versions && versions.network ? versions.network : 'v1'
      }
    } catch (_err) {
      throw new Error(`Error during loading data: ${_err.message}`)
    }
  }
}
