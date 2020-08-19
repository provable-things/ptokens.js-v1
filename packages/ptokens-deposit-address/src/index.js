import Web3PromiEvent from 'web3-core-promievent'
import Web3Utils from 'web3-utils'
import * as bitcoin from 'bitcoinjs-lib'
import * as utils from 'ptokens-utils'

const HOST_NODE_POLLING_TIME_INTERVAL = 3000
const POLLING_TIME = 3000

// NOTE: will be removed in versions > 1.0.0
const hostBlockchainEvents = {
  ethereum: 'onEthTxConfirmed',
  eosio: 'onEosTxConfirmed'
}

bitcoin.networks.litecoin = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0
}

bitcoin.networks.litecoinTestnet = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x6f,
  scriptHash: 0x3a,
  wif: 0xb0
}

export class DepositAddress {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      nativeBlockchain,
      nativeNetwork,
      hostBlockchain,
      hostNetwork,
      hostApi,
      node
    } = _configs

    this.hostBlockchain = hostBlockchain
    this.hostNetwork = hostNetwork
    this.nativeBlockchain = nativeBlockchain
    this.nativeNetwork = nativeNetwork

    this.node = node
    this.hostApi = hostApi
  }

  /**
   * @param {String} _hostAddress
   */
  async generate(_hostAddress) {
    if (
      this.hostBlockchain === utils.constants.blockchains.Ethereum &&
      !Web3Utils.isAddress(_hostAddress)
    )
      throw new Error('Eth Address is not valid')

    if (
      this.hostBlockchain === utils.constants.blockchains.Eosio &&
      !utils.eos.isValidAccountName(_hostAddress)
    )
      throw new Error('EOS Account is not valid')

    try {
      const deposit = await this.node.generic(
        'GET',
        `get-native-deposit-address/${_hostAddress}`
      )

      this.nonce = deposit.nonce
      this.enclavePublicKey = deposit.enclavePublicKey
      this.value = deposit.nativeDepositAddress
      this.hostAddress = _hostAddress
      return this.value
    } catch (err) {
      throw new Error('Error during deposit address generation')
    }
  }

  toString() {
    return this.value
  }

  verify() {
    const { constants } = utils

    let network
    if (
      this.nativeNetwork === constants.networks.BitcoinMainnet &&
      this.nativeBlockchain === constants.blockchains.Bitcoin
    ) {
      network = bitcoin.networks.bitcoin
    } else if (
      this.nativeNetwork === constants.networks.BitcoinTestnet &&
      this.nativeBlockchain === constants.blockchains.Bitcoin
    ) {
      network = bitcoin.networks.testnet
    } else if (
      this.nativeNetwork === constants.networks.LitecoinMainnet &&
      this.nativeBlockchain === constants.blockchains.Litecoin
    ) {
      network = bitcoin.networks.litecoin
    } else if (
      this.nativeNetwork === constants.networks.LitecoinTestnet &&
      this.nativeBlockchain === constants.blockchains.Litecoin
    ) {
      network = bitcoin.networks.litecoinTestnet
    } else {
      throw new Error(
        'Please use a valid combination of nativeNetwork and nativeBlockchain'
      )
    }

    const hostAddressBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.hostAddress),
      this.hostBlockchain === constants.blockchains.Ethereum ? 'hex' : 'utf-8'
    )
    const nonceBuf = utils.converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(
      utils.eth.removeHexPrefix(this.enclavePublicKey),
      'hex'
    )

    const hostAddressAndNonceHashBuf = bitcoin.crypto.hash256(
      Buffer.concat([hostAddressBuf, nonceBuf])
    )

    const output = bitcoin.script.compile(
      [].concat(
        hostAddressAndNonceHashBuf,
        bitcoin.opcodes.OP_DROP,
        enclavePublicKeyBuf,
        bitcoin.opcodes.OP_CHECKSIG
      )
    )

    const p2sh = bitcoin.payments.p2sh({
      redeem: {
        output,
        network
      },
      network
    })

    return p2sh.address === this.value
  }

  waitForDeposit() {
    const promiEvent = Web3PromiEvent()

    if (!this.hostApi) {
      promiEvent.reject('Provider not specified. Impossible to monitor the tx')
      return
    }

    const start = async () => {
      if (!this.value) promiEvent.reject('Please generate a deposit address')
      
      const utxoToMonitor = await utils[
        utils.helpers.getBlockchainShortType(this.nativeBlockchain)
      ].monitorUtxoByAddress(
        this.nativeNetwork,
        this.value,
        promiEvent.eventEmitter,
        POLLING_TIME,
        'nativeTxBroadcasted',
        'nativeTxConfirmed'
      )

      const broadcastedHostTxReport = await this.node.monitorIncomingTransaction(
        utxoToMonitor,
        promiEvent.eventEmitter
      )

      const hostTxReceipt = await utils[
        utils.helpers.getBlockchainShortType(this.hostBlockchain)
      ].waitForTransactionConfirmation(
        this.hostApi,
        broadcastedHostTxReport.broadcast_tx_hash,
        HOST_NODE_POLLING_TIME_INTERVAL
      )

      promiEvent.eventEmitter.emit(
        hostBlockchainEvents[this.hostBlockchain],
        hostTxReceipt
      )
      promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)

      promiEvent.resolve({
        to: this.hostAddress,
        tx: broadcastedHostTxReport.broadcast_tx_hash,
        amount: utils.eth
          .offChainFormat(broadcastedHostTxReport.host_tx_amount, 8)
          .toFixed()
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}
