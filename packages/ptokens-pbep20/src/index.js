import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { abi, constants, eth, helpers, redeemFrom } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3Utils from 'web3-utils'
import minimumAmounts from './minimum-amounts'

export class pBEP20 extends NodeSelector {
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      constants.blockchains.BinanceSmartChain
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
      bscPrivateKey,
      bscProvider,
      ethPrivateKey,
      ethProvider,
      polygonPrivateKey,
      polygonProvider,
      algoProvider,
      algoClient
    } = _configs

    if (bscProvider) this.web3 = new Web3(bscProvider)
    if (bscPrivateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(eth.addHexPrefix(bscPrivateKey))
      this.web3.eth.defaultAccount = account.address
      this.bscPrivateKey = eth.addHexPrefix(bscPrivateKey)
    } else {
      this.bscPrivateKey = null
    }

    if (ethProvider) this.hostApi = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
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

    if (algoProvider) this.hostApi = algoProvider
    if (algoClient) this.algoClient = algoClient

    this._peginBnb = false
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
   *
   * @param {string|number} _amount
   * @param {string} _nativeAccount
   * @param {Options} _options
   */
  redeem(_amount, _nativeAccount, _options = {}) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        const { gas, gasPrice, from } = _options
        const { blockchains } = constants

        await this._loadData()

        const minimumAmount = minimumAmounts[this.pToken.toLowerCase()].redeem[this.hostBlockchain]
        if (BigNumber(_amount).isLessThan(minimumAmount)) {
          promiEvent.reject(`Impossible to redeem less than ${minimumAmount}`)
          return
        }

        if (this.nativeBlockchain === blockchains.BinanceSmartChain && !Web3Utils.isAddress(_nativeAccount)) {
          promiEvent.reject('Invalid native account')
          return
        }

        if (!this.selectedNode) await this.select()

        const { redeemFromEvmCompatible, redeemFromAlgorand } = redeemFrom

        let hostTxHash
        if (this.hostBlockchain === blockchains.Ethereum || this.hostBlockchain === blockchains.Polygon) {
          const hostTxReceipt = await redeemFromEvmCompatible(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress: this.hostContractAddress,
              value: 0
            },
            [_amount, _nativeAccount],
            promiEvent,
            'hostTxBroadcasted'
          )

          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.transactionHash
        }

        if (this.hostBlockchain === blockchains.Algorand) {
          const destinationChainId = constants.chainIds[this.hostBlockchain][this.hostNetwork]
          const hostTxReceipt = await redeemFromAlgorand({
            provider: this.hostApi,
            client: this.algoClient,
            amount: _amount,
            to: this.hostIdentity,
            assetIndex: this.hostContractAddress,
            nativeAccount: _nativeAccount,
            from,
            destinationChainId,
            eventEmitter: promiEvent.eventEmitter
          })
          promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
          hostTxHash = hostTxReceipt.txID().toString()
        }

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(hostTxHash, promiEvent.eventEmitter)
        const nativeTxReceipt = await eth.waitForTransactionConfirmation(
          this.hostApi,
          incomingTxReport.broadcast_tx_hash
        )
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
        const { blockchains, chainIds } = constants
        await this._loadData()

        const minimumAmount = minimumAmounts[this.pToken.toLowerCase()].issue
        if (BigNumber(_amount).isLessThan(minimumAmount)) {
          promiEvent.reject(`Impossible to issue less than ${minimumAmount}`)
          return
        }

        if (
          (this.hostBlockchain === blockchains.Ethereum || this.hostBlockchain === blockchains.Polygon) &&
          !Web3Utils.isAddress(_hostAccount)
        ) {
          promiEvent.reject('Invalid host account')
          return
        }

        if (!this.selectedNode) await this.select()

        const destinationChainId = this.version === 'v2' ? chainIds[this.hostBlockchain][this.hostNetwork] : null

        let bscTxHash = null
        const waitForEthTransaction = () =>
          new Promise((_resolve, _reject) => {
            eth[this.bscPrivateKey ? 'sendSignedMethodTx' : 'makeContractSend'](
              this.web3,
              this._peginBnb ? 'pegInEth' : 'pegIn',
              {
                privateKey: this.bscPrivateKey,
                abi: this.version === 'v1' ? abi.pERC20Vault : abi.pERC20VaultV2,
                gas,
                gasPrice,
                contractAddress: eth.addHexPrefix(this.nativeVaultAddress),
                value: 0
              },
              this.version === 'v1'
                ? _metadata
                  ? this._peginBnb
                    ? [_hostAccount, _metadata]
                    : [_amount, this.nativeContractAddress, _hostAccount, _metadata]
                  : this._peginBnb
                    ? [_hostAccount]
                    : [_amount, this.nativeContractAddress, _hostAccount]
                : _metadata
                  ? this._peginBnb
                    ? [_hostAccount, destinationChainId, _metadata]
                    : [_amount, this.nativeContractAddress, _hostAccount, _metadata, destinationChainId]
                  : this._peginBnb
                    ? [_hostAccount, destinationChainId]
                    : [_amount, this.nativeContractAddress, _hostAccount, destinationChainId]
            )
              .once('transactionHash', _hash => {
                bscTxHash = _hash
                promiEvent.eventEmitter.emit('nativeTxBroadcasted', bscTxHash)
              })
              .once('receipt', _resolve)
              .once('error', _reject)
          })
        const ethTxReceipt = await waitForEthTransaction()
        promiEvent.eventEmitter.emit('nativeTxConfirmed', ethTxReceipt)

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(bscTxHash, promiEvent.eventEmitter)

        let hostTxReceipt
        if (this.hostBlockchain === blockchains.Ethereum)
          hostTxReceipt = await eth.waitForTransactionConfirmation(this.hostApi, incomingTxReport.broadcast_tx_hash)

        promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)
        promiEvent.resolve({
          to: _hostAccount,
          nativeTx: bscTxHash,
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

  async _loadData() {
    try {
      if (!this.selectedNode) await this.select()
      if (!this.nativeContractAddress || !this.hostContractAddress) {
        const {
          native_smart_contract_address,
          host_smart_contract_address,
          native_vault_address,
          versions,
          host_identity
        } = await this.selectedNode.getInfo()
        this.nativeContractAddress = eth.addHexPrefix(native_smart_contract_address)
        this.hostContractAddress =
          this.hostBlockchain !== constants.blockchains.Algorand
            ? eth.addHexPrefix(host_smart_contract_address)
            : host_smart_contract_address
        this.nativeVaultAddress = native_vault_address ? eth.addHexPrefix(native_vault_address) : null
        this.version = versions && versions.network ? versions.network : 'v1'
        this.hostIdentity = host_identity
      }
    } catch (_err) {
      throw new Error(`Error during loading data: ${_err.message}`)
    }
  }
}
