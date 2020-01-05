import Web3PromiEvent from 'web3-core-promievent'
import Web3 from 'web3'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import Esplora from './utils/esplora'
import polling from 'light-async-polling'
import {
  ESPLORA_POLLING_TIME
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
        utils.eth.addHexPrefix(ethPrivateKey)
      )

      this.web3.eth.defaultAccount = account.address
      this.ethPrivateKey = utils.eth.addHexPrefix(ethPrivateKey)
      this.isWeb3Injected = false
    }

    if (
      btcNetwork === 'bitcoin' ||
      btcNetwork === 'testnet'
    )
      this.btcNetwork = btcNetwork
    else
      this.btcNetwork = 'testnet'

    this.esplora = new Esplora(this.btcNetwork)
  }

  /**
   * @param {String} _ethAddress
   */
  async getDepositAddress(_ethAddress) {
    if (!Web3Utils.isAddress(_ethAddress))
      throw new Error('Eth Address is not valid')

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
    const network = this.btcNetwork === bitcoin
      ? bitcoin.networks.mainnet
      : bitcoin.networks.testnet

    const ethAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(_ethAddress),
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

  /**
   * @param {String} _depositAddress
   */
  monitorIssueByDepositAddress(_depositAddress) {
    const promiEvent = Web3PromiEvent()

    const start = async () => {
      let isBroadcasted = false
      await polling(async () => {
        const txs = await this.esplora.makeApiCall(
          'GET',
          `/address/${_depositAddress}/txs/mempool`
        )

        if (txs.length > 0) {
          isBroadcasted = true
          promiEvent.eventEmitter.emit('onBtcTxBroadcasted', txs[0].txid)
          return false
        }

        const utxos = await this.esplora.makeApiCall(
          'GET',
          `/address/${_depositAddress}/utxo`
        )

        // NOTE: an user could make 2 payments to the same depositAddress -> utxos.length could become > 0 but with a wrong utxo

        if (utxos.length > 0) {
          if (!isBroadcasted)
            promiEvent.eventEmitter.emit('onBtcTxBroadcasted', utxos[0].txid)

          promiEvent.eventEmitter.emit('onBtcTxConfirmed', utxos[0].txid)
          return true
        } else {
          return false
        }
      }, ESPLORA_POLLING_TIME)

      // TODO: check the enclave issuing status

      promiEvent.resolve() // TODO: choose params to return
    }

    start()
    return promiEvent.eventEmitter
  }
}

export default pBTC
