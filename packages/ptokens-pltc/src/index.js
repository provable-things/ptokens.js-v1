import Web3 from 'web3'
import Web3PromiEvent from 'web3-core-promievent'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import LtcDepositAddress from './lib/ltc-deposit-address'
import pltcAbi from './utils/contractAbi/pLTCTokenETHContractAbi.json'
import * as bitcoin from 'bitcoinjs-lib'
import {
  PLTC_TOKEN_DECIMALS,
  MINIMUN_SATS_REDEEMABLE,
  LTC_NODE_POLLING_TIME
} from './utils/constants'

class pLTC {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { ethPrivateKey, ethProvider, ltcNetwork } = _configs

    this._web3 = new Web3(ethProvider)

    this.enclave = new Enclave({
      pToken: 'pltc'
    })

    if (ethPrivateKey) {
      this._isWeb3Injected = false
      const account = this._web3.eth.accounts.privateKeyToAccount(
        utils.eth.addHexPrefix(ethPrivateKey)
      )

      this._web3.eth.defaultAccount = account.address
      this._ethPrivateKey = utils.eth.addHexPrefix(ethPrivateKey)
      this._isWeb3Injected = false
    } else {
      this._isWeb3Injected = true
      this._ethPrivateKey = null
    }

    if (ltcNetwork === 'litecoin' || ltcNetwork === 'testnet')
      this._ltcNetwork = ltcNetwork
    else this._ltcNetwork = 'testnet'

    this._contractAddress = null
  }

  /**
   * @param {String} _ethAddress
   */
  async getDepositAddress(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

    const deposit = await this.enclave.generic(
      'GET',
      `get-ltc-deposit-address/${this._ltcNetwork}/${_ethAddress}`
    )

    const depositAddress = new LtcDepositAddress({
      ethAddress: _ethAddress,
      nonce: deposit.nonce,
      enclavePublicKey: deposit.enclavePublicKey,
      value: deposit.btcDepositAddress,
      ltcNetwork: this._ltcNetwork,
      enclave: this.enclave,
      web3: this._web3
    })

    if (!depositAddress.verify())
      throw new Error('Enclave deposit address does not match expected address')

    return depositAddress
  }

  /**
   * @param {Number} _amount
   * @param {String} _ltcAddress
   */
  redeem(_amount, _ltcAddress) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      if (_amount < MINIMUN_SATS_REDEEMABLE) {
        promiEvent.reject(
          `Impossible to burn less than ${MINIMUN_SATS_REDEEMABLE} pLTC`
        )
        return
      }

      // NOTE: add support for p2sh testnet address (Q...)
      let ltcAddressToCheck = _ltcAddress
      const decoded = bitcoin.address.fromBase58Check(_ltcAddress)
      if (decoded.version === 0xc4)
        ltcAddressToCheck = bitcoin.address.toBase58Check(decoded.hash, 0x3a)

      if (!utils.ltc.isValidAddress(this._ltcNetwork, ltcAddressToCheck)) {
        promiEvent.reject('Ltc Address is not valid')
        return
      }

      try {
        const ethTxReceipt = await utils.eth.makeContractSend(
          this._web3,
          'burn',
          {
            isWeb3Injected: this._isWeb3Injected,
            abi: pltcAbi,
            contractAddress: this._getContractAddress(),
            privateKey: this._ethPrivateKey,
            value: utils.eth.zeroEther
          },
          [
            utils.eth.correctFormat(_amount, PLTC_TOKEN_DECIMALS, '*'),
            _ltcAddress
          ]
        )
        promiEvent.eventEmitter.emit('onEthTxConfirmed', ethTxReceipt)

        const broadcastedLtcTx = await this.enclave.monitorIncomingTransaction(
          ethTxReceipt.transactionHash,
          'redeem',
          promiEvent.eventEmitter
        )

        await utils.ltc.waitForTransactionConfirmation(
          this._ltcNetwork,
          broadcastedLtcTx,
          LTC_NODE_POLLING_TIME
        )
        promiEvent.eventEmitter.emit('onLtcTxConfirmed', broadcastedLtcTx)

        promiEvent.resolve({
          amount: _amount.toFixed(PLTC_TOKEN_DECIMALS),
          to: _ltcAddress,
          tx: broadcastedLtcTx
        })
      } catch (err) {
        promiEvent.reject(err)
      }
    }

    start()
    return promiEvent.eventEmitter
  }

  getTotalIssued() {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(this._web3, 'totalMinted', {
          isWeb3Injected: this._isWeb3Injected,
          abi: pltcAbi,
          contractAddress: this._getContractAddress()
        })
        .then(totalIssued =>
          resolve(
            utils.eth.correctFormat(
              parseInt(totalIssued),
              PLTC_TOKEN_DECIMALS,
              '/'
            )
          )
        )
        .catch(err => reject(err))
    })
  }

  getTotalRedeemed() {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(this._web3, 'totalBurned', {
          isWeb3Injected: this._isWeb3Injected,
          abi: pltcAbi,
          contractAddress: this._getContractAddress()
        })
        .then(totalRedeemed =>
          resolve(
            utils.eth.correctFormat(
              parseInt(totalRedeemed),
              PLTC_TOKEN_DECIMALS,
              '/'
            )
          )
        )
        .catch(err => reject(err))
    })
  }

  getCirculatingSupply() {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(this._web3, 'totalSupply', {
          isWeb3Injected: this._isWeb3Injected,
          abi: pltcAbi,
          contractAddress: this._getContractAddress()
        })
        .then(totalSupply =>
          resolve(
            utils.eth.correctFormat(
              parseInt(totalSupply),
              PLTC_TOKEN_DECIMALS,
              '/'
            )
          )
        )
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _ethAddress
   */
  getBalance(_ethAddress) {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(
          this._web3,
          'balanceOf',
          {
            isWeb3Injected: this._isWeb3Injected,
            abi: pltcAbi,
            contractAddress: this._getContractAddress()
          },
          [_ethAddress]
        )
        .then(balance =>
          resolve(
            utils.eth.correctFormat(parseInt(balance), PLTC_TOKEN_DECIMALS, '/')
          )
        )
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _to
   * @param {Number} _amount
   */
  transfer(_to, _amount) {
    return utils.eth.makeContractSend(
      this._web3,
      'transfer',
      {
        isWeb3Injected: this._isWeb3Injected,
        abi: pltcAbi,
        contractAddress: this._getContractAddress(),
        privateKey: this._ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _to,
        utils.eth.correctFormat(parseInt(_amount), PLTC_TOKEN_DECIMALS, '*')
      ]
    )
  }

  /**
   * @param {String} _spender
   * @param {Number} _amount
   */
  approve(_spender, _amount) {
    return utils.eth.makeContractSend(
      this._web3,
      'approve',
      {
        isWeb3Injected: this._isWeb3Injected,
        abi: pltcAbi,
        contractAddress: this._getContractAddress(),
        privateKey: this._ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _spender,
        utils.eth.correctFormat(parseInt(_amount), PLTC_TOKEN_DECIMALS, '*')
      ]
    )
  }

  /**
   * @param {String} _from
   * @param {String} _to
   * @param {Number} _amount
   */
  transferFrom(_from, _to, _amount) {
    return utils.eth.makeContractSend(
      this._web3,
      'transferFrom',
      {
        isWeb3Injected: this._isWeb3Injected,
        abi: pltcAbi,
        contractAddress: this._getContractAddress(),
        privateKey: this._ethPrivateKey,
        value: utils.eth.zeroEther
      },
      [
        _from,
        _to,
        utils.eth.correctFormat(parseInt(_amount), PLTC_TOKEN_DECIMALS, '*')
      ]
    )
  }

  getBurnNonce() {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(this._web3, 'burnNonce', {
          isWeb3Injected: this._isWeb3Injected,
          abi: pltcAbi,
          contractAddress: this._getContractAddress()
        })
        .then(burnNonce => resolve(parseInt(burnNonce)))
        .catch(err => reject(err))
    })
  }

  getMintNonce() {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(this._web3, 'mintNonce', {
          isWeb3Injected: this._isWeb3Injected,
          abi: pltcAbi,
          contractAddress: this._getContractAddress()
        })
        .then(mintNonce => resolve(parseInt(mintNonce)))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} _owner
   * @param {Address} _spender
   */
  getAllowance(_owner, _spender) {
    return new Promise((resolve, reject) => {
      utils.eth
        .makeContractCall(
          this._web3,
          'allowance',
          {
            isWeb3Injected: this._isWeb3Injected,
            abi: pltcAbi,
            contractAddress: this._getContractAddress()
          },
          [_owner, _spender]
        )
        .then(allowance =>
          resolve(
            utils.eth.correctFormat(
              parseInt(allowance),
              PLTC_TOKEN_DECIMALS,
              '/'
            )
          )
        )
        .catch(err => reject(err))
    })
  }

  async _getContractAddress() {
    if (!this._contractAddress) {
      const ethNetwork = await this._web3.eth.net.getNetworkType()
      const info = await this.enclave.getInfo(this._ltcNetwork, ethNetwork)
      this._contractAddress = info['pbtc-smart-contract-address']
    }

    return this._contractAddress
  }
}

export default pLTC
