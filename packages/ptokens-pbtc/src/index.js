import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import {
  PBTC_MAINNET,
  PBTC_TESTNET
} from './utils/constants'

class pBTC {
  /**
   * @param {Object} _configs 
   */
  constructor(_configs) {
    const {
      web3,
      ethPrivateKey,
      ethProvider,
      btcNetwork
    } = _configs

    this.enclave = new Enclave({
      pToken: 'pbtc'
    })

    if (web3) {
      this.isWeb3Injected = true
      this.web3 = web3
      this.ethPrivateKey = null
    } else if (
      ethPrivateKey &&
      ethProvider
    ) {
      this.web3 = new Web3(ethProvider)

      const account = this.web3.eth.accounts.privateKeyToAccount(
        utils.eth.alwaysWithPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = utils.eth.alwaysWithPrefix(ethPrivateKey)
      this.isWeb3Injected = false
    }

    switch (btcNetwork) {
      case PBTC_MAINNET: {
        this.btcNetwork = PBTC_MAINNET
        break
      }
      case PBTC_TESTNET: {
        this.btcNetwork = PBTC_TESTNET
        break
      }
      default: {
        this.btcNetwork = PBTC_TESTNET
        break
      }
    }
  }

  /**
   * @param {String} _ethAddress 
   */
  async getDepositAddress(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress)) {
      throw new Error('Eth Address is not valid')
    }
    
    const deposit = await this.enclave.generic(
      'GET',
      `get-btc-deposit-address/${this.btcNetwork}/${_ethAddress}`
    )

    if (!this.verifyDepositAddress(deposit, _ethAddress))
      throw new Error('Enclave deposit address does not match expected address')

    return deposit.btcDepositAddress
  }

  /**
   * @param {Number} _deposit 
   * @param {String} _ethAdress
   */
  verifyDepositAddress(_deposit, _ethAddress) {

    const network = this.btcNetwork === PBTC_MAINNET
      ? bitcoin.networks.mainnet
      : bitcoin.networks.testnet

    const ethAddressBuf = Buffer.from(
      utils.eth.alwaysWithoutPrefix(_ethAddress),
      'hex'
    )
    const nonceBuf = utils.converters.encodeUint64le(_deposit.nonce)
    const enclavePublicKeyBuf = Buffer.from(_deposit.enclavePublicKey, 'hex')
      
    const ethAddressAndNonceHashBuf = bitcoin.crypto.hash256(
      Buffer.concat([ethAddressBuf, nonceBuf])
    )

    const output = bitcoin.script.compile([].concat( 
      ethAddressAndNonceHashBuf,
      bitcoin.opcodes.OP_DROP,
      enclavePublicKeyBuf,
      bitcoin.opcodes.OP_CHECKSIG
    ))
      
    const p2sh = bitcoin.payments.p2sh(
      {
        redeem: {
          output,
          network
        },
        network
      }
    )
    
    return p2sh.address === _deposit.btcDepositAddress
  }
}

export default pBTC