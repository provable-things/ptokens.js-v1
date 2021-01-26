import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { constants, eth, eos, helpers, redeemFrom } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3Utils from 'web3-utils'
import minimumAmounts from './minimum-amounts'

export class pEOSToken extends NodeSelector {
  constructor(_configs) {
    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      constants.blockchains.Ethereum
    )

    super({
      pToken: _configs.pToken,
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork,
      defaultNode: _configs.defaultNode
    })

    const { ethPrivateKey, ethProvider, eosPrivateKey, eosRpc, eosSignatureProvider } = _configs

    if (eosSignatureProvider) {
      this.eosApi = eos.getApi(null, eosRpc, eosSignatureProvider)
    } else if (eosPrivateKey && eosRpc) {
      this.eosApi = eos.getApi(eosPrivateKey, eosRpc, null)
      this.eosPrivateKey = eosPrivateKey
    } else if (!eosSignatureProvider && !eosPrivateKey && eosRpc) {
      this.eosApi = eos.getApi(null, eosRpc, null)
    }

    if (ethProvider) this.hostApi = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.hostApi.eth.accounts.privateKeyToAccount(eth.addHexPrefix(ethPrivateKey))
      this.hostApi.eth.defaultAccount = account.address
      this.hostPrivateKey = eth.addHexPrefix(ethPrivateKey)
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
    const { blocksBehind, expireSeconds } = _options

    const start = async () => {
      try {
        await this._loadData()

        if (BigNumber(_amount).isLessThan(minimumAmounts[this.nativeContractAddress].issue)) {
          promiEvent.reject(`Impossible to issue less than ${minimumAmounts[this.nativeContractAddress].issue}`)
          return
        }

        if (this.hostBlockchain === constants.blockchains.Ethereum && !Web3Utils.isAddress(_hostAccount)) {
          promiEvent.reject('Invalid host account')
          return
        }

        if (!this.selectedNode) await this.select()

        const eosPublicKeys = await this.eosApi.signatureProvider.getAvailableKeys()
        const eosAccountName = await eos.getAccountName(this.eosApi.rpc, eosPublicKeys)
        if (!eosAccountName) {
          // prettier-ignore
          throw new Error('Account name does not exist. Check that you entered it correctly or make sure to have enabled history plugin')
        }

        const nativeTxReceipt = await this.eosApi.transact(
          {
            actions: [
              {
                account: this.nativeContractAddress,
                name: 'transfer',
                authorization: [
                  {
                    actor: eosAccountName,
                    permission: 'active'
                  }
                ],
                data: {
                  sender: eosAccountName,
                  quantity: eos.getAmountInEosFormat(_amount, 8, this.pToken.slice(1).toUpperCase()),
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
   * @param {RedeemOptions} _options
   */
  redeem(_amount, _account, _options = {}) {
    const promiEvent = Web3PromiEvent()
    const { gas, gasPrice } = _options

    const start = async () => {
      try {
        if (BigNumber(_amount).isLessThan(minimumAmounts[this.nativeContractAddress].redeem)) {
          promiEvent.reject(`Impossible to redeem less than ${minimumAmounts[this.nativeContractAddress].redeem}`)
          return
        }

        if (!eos.isValidAccountName(_account)) {
          promiEvent.reject('Invalid native account')
          return
        }

        await this._loadData()

        let hostTxHash = null
        if (this.hostBlockchain === constants.blockchains.Ethereum) {
          const ethTxReceipt = await redeemFrom.redeemFromEthereum(
            this.hostApi,
            {
              privateKey: this.hostPrivateKey,
              gas,
              gasPrice,
              contractAddress: this.hostContractAddress,
              value: 0
            },
            [_amount, _account],
            promiEvent,
            'hostTxBroadcasted'
          )
          promiEvent.eventEmitter.emit('hostTxConfirmed', ethTxReceipt)
          hostTxHash = ethTxReceipt.transactionHash
        }

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(hostTxHash, promiEvent.eventEmitter)

        const nativeTxReceipt = await eos.waitForTransactionConfirmation(
          this.eosApi,
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
          host_smart_contract_address
          // native_vault_address
        } = await this.selectedNode.getInfo()
        this.nativeContractAddress = eth.addHexPrefix(native_smart_contract_address)
        this.hostContractAddress =
          this.hostBlockchain === constants.blockchains.Ethereum
            ? eth.addHexPrefix(host_smart_contract_address)
            : host_smart_contract_address
        // this.nativeVaultAccount = native_vault_address ? eth.addHexPrefix(native_vault_address) : null
      }

      return this.nativeContractAddress
    } catch (_err) {
      throw new Error(`Error during loading data: ${_err.message}`)
    }
  }
}
