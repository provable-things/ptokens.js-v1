import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import { NodeSelector } from 'ptokens-node-selector'
import { abi, constants, eth, eos, helpers, redeemFrom } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3Utils from 'web3-utils'

const minimumAmounts = {
  [eth.zeroAddress]: {
    issue: 1000000000,
    redeem: 0.000000001
  }
}

export class pERC20 extends NodeSelector {
  constructor(_configs) {
    const {
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork
    } = helpers.parseParams(_configs, constants.blockchains.Ethereum)

    super({
      pToken: _configs.pToken,
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
      eosSignatureProvider,
      tokenAddress,
      pToken
    } = _configs

    if (!tokenAddress || !Web3Utils.isAddress(tokenAddress)) {
      throw new Error('Invalid token address')
      return
    }

    if (
      (!ethPrivateKey && !ethProvider) ||
      (!eosPrivateKey && !eosSignatureProvider)
    ) {
      throw new Error('Bad Initialization.')
    }

    if (ethProvider) this.web3 = new Web3(ethProvider)
    if (ethPrivateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(
        eth.addHexPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = eth.addHexPrefix(ethPrivateKey)
    } else {
      this.ethPrivateKey = null
    }

    if (eosSignatureProvider) {
      this.hostApi = eos.getApi(null, eosRpc, eosSignatureProvider)
    } else if (eosPrivateKey && eosRpc) {
      this.hostApi = eos.getApi(eosPrivateKey, eosRpc, null)
      this.hostPrivateKey = eosPrivateKey
    } else if (!eosSignatureProvider && !eosPrivateKey && eosRpc) {
      this.hostApi = eos.getApi(null, eosRpc, null)
    }

    this.tokenAddress = tokenAddress
    this.pToken = pToken
  }
  /**
   * @param {String|BigNumber|BN} _amount in wei
   * @param {String} _hostAccount
   * @param {IssueOptions} _options
   */
  issue(_amount, _hostAccount, _options = {}) {
    const promiEvent = Web3PromiEvent()
    const { gas, gasPrice } = _options

    const start = async () => {
      try {
        if (
          BigNumber(_amount).isLessThan(minimumAmounts[this.tokenAddress].issue)
        ) {
          // prettier-ignore
          promiEvent.reject(`Impossible to issue less than ${minimumAmounts[this.tokenAddress].issue}`)
          return
        }

        if (
          this.hostBlockchain === constants.blockchains.Eosio &&
          !eos.isValidAccountName(_hostAccount)
        ) {
          promiEvent.reject('Invalid host account')
          return
        }

        if (!this.selectedNode) await this.select()
        await this._loadContractAddresses()

        const ethTxHash = await eth[
          this.ethPrivateKey ? 'sendSignedMethodTx' : 'makeContractSend'
        ](
          this.web3,
          this.tokenAddress === eth.zeroAddress ? 'pegInEth' : 'pegIn',
          {
            privateKey: this.ethPrivateKey,
            abi: abi.pERC20Native,
            gas,
            gasPrice,
            contractAddress: eth.addHexPrefix(this.nativeContractAddress),
            value: this.tokenAddress === eth.zeroAddress ? _amount : 0
          },
          this.tokenAddress === eth.zeroAddress
            ? [_hostAccount]
            : [_amount, this.tokenAddress, _hostAccount]
        )
        promiEvent.eventEmitter.emit('nativeTxBroadcasted', ethTxHash)

        const ethTxReceipt = await eth.waitForTransactionConfirmation(
          this.web3,
          ethTxHash,
          5000
        )
        promiEvent.eventEmitter.emit('nativeTxConfirmed', ethTxReceipt)

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(
          ethTxHash,
          promiEvent.eventEmitter
        )

        let hostTxReceipt
        if (this.hostBlockchain === constants.blockchains.Eosio) {
          hostTxReceipt = await eos.waitForTransactionConfirmation(
            this.hostApi,
            incomingTxReport.broadcast_tx_hash
          )
        } else {
          throw new Error('Host blockchain not supported')
        }

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
   */
  redeem(_amount, _nativeAccount) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      try {
        if (
          BigNumber(_amount).isLessThan(
            minimumAmounts[this.tokenAddress].redeem
          )
        ) {
          // prettier-ignore
          promiEvent.reject(`Impossible to redeem less than ${minimumAmounts[this.tokenAddress].redeem}`)
          return
        }

        if (
          this.nativeBlockchain === constants.blockchains.Ethereum &&
          !Web3Utils.isAddress(_nativeAccount)
        ) {
          promiEvent.reject('Invalid native account')
          return
        }

        if (!this.selectedNode) await this.select()
        await this._loadContractAddresses()

        const { redeemFromEosio } = redeemFrom

        let hostTxHash
        if (this.hostBlockchain === constants.blockchains.Eosio) {
          const eosTxReceipt = await redeemFromEosio(
            this.hostApi,
            _amount,
            _nativeAccount,
            9, // NOTE: WETH decimals on EOS
            this.hostContractAddress,
            this.pToken === constants.pTokens.pWETH ? 'peth' : this.pToken
          )

          promiEvent.eventEmitter.emit('hostTxConfirmed', eosTxReceipt)
          hostTxHash = eosTxReceipt.transaction_id
        }

        const incomingTxReport = await this.selectedNode.monitorIncomingTransaction(
          hostTxHash,
          promiEvent.eventEmitter
        )

        const nativeTxReceipt = await eth.waitForTransactionConfirmation(
          this.web3,
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

  async _loadContractAddresses() {
    try {
      if (!this.selectedNode) await this.select()
      if (!this.nativeContractAddress || !this.hostContractAddress) {
        const {
          native_smart_contract_address,
          host_smart_contract_address
        } = await this.selectedNode.getInfo()
        this.nativeContractAddress = native_smart_contract_address
        this.hostContractAddress = host_smart_contract_address
      }

      return this.nativeContractAddress
    } catch (_err) {
      throw new Error(`Error during getting contract address: ${_err.message}`)
    }
  }
}
