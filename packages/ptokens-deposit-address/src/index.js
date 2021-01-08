import Web3PromiEvent from 'web3-core-promievent'
import Web3Utils from 'web3-utils'
import BigNumber from 'bignumber.js'
import * as bitcoin from 'bitcoinjs-lib'
import * as utils from 'ptokens-utils'

const HOST_NODE_POLLING_TIME_INTERVAL = 3000
const POLLING_TIME = 3000

const confirmations = {
  btc: 1,
  ltc: 4,
  doge: 1
}

// NOTE: will be removed in versions >= 1.0.0
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

bitcoin.networks.dogecoin = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e
}

const {
  constants: {
    networks: { BitcoinMainnet, BitcoinTestnet, LitecoinMainnet, LitecoinTestnet, DogecoinMainnet },
    blockchains: { Bitcoin, Litecoin, Dogecoin }
  }
} = utils
const NETWORKS = {
  [Bitcoin]: {
    [BitcoinMainnet]: bitcoin.networks.bitcoin,
    [BitcoinTestnet]: bitcoin.networks.testnet
  },
  [Litecoin]: {
    [LitecoinMainnet]: bitcoin.networks.litecoin,
    [LitecoinTestnet]: bitcoin.networks.litecoinTestnet
  },
  [Dogecoin]: {
    [DogecoinMainnet]: bitcoin.networks.dogecoin
  }
}

export class DepositAddress {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { nativeBlockchain, nativeNetwork, hostBlockchain, hostNetwork, hostApi, node } = _configs

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
    if (this.hostBlockchain === utils.constants.blockchains.Ethereum && !Web3Utils.isAddress(_hostAddress))
      throw new Error('Invalid Ethereum Address')

    if (this.hostBlockchain === utils.constants.blockchains.Eosio && !utils.eos.isValidAccountName(_hostAddress))
      throw new Error('Invalid EOS Account')

    try {
      const { nonce, enclavePublicKey, nativeDepositAddress } = await this.node.getNativeDepositAddress(_hostAddress)

      this.nonce = nonce
      this.enclavePublicKey = enclavePublicKey
      this.value = nativeDepositAddress
      this.hostAddress = _hostAddress
      return this.value
    } catch (_err) {
      throw new Error('Error during deposit address generation')
    }
  }

  toString() {
    return this.value
  }

  verify() {
    const {
      constants: {
        blockchains: { Eosio, Telos }
      }
    } = utils
    const network = NETWORKS[this.nativeBlockchain][this.nativeNetwork]
    if (!network) throw new Error('Please use a valid combination of nativeNetwork and nativeBlockchain')

    // NOTE: eos account name are utf-8 encoded
    const hostAddressBuf =
      this.hostBlockchain === Eosio || this.hostBlockchain === Telos
        ? Buffer.from(this.hostAddress, 'utf-8')
        : Buffer.from(utils.eth.removeHexPrefix(this.hostAddress), 'hex')

    const nonceBuf = utils.converters.encodeUint64le(this.nonce)
    const enclavePublicKeyBuf = Buffer.from(utils.eth.removeHexPrefix(this.enclavePublicKey), 'hex')
    const hostAddressAndNonceHashBuf = bitcoin.crypto.hash256(Buffer.concat([hostAddressBuf, nonceBuf]))
    const output = bitcoin.script.compile(
      [].concat(hostAddressAndNonceHashBuf, bitcoin.opcodes.OP_DROP, enclavePublicKeyBuf, bitcoin.opcodes.OP_CHECKSIG)
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

      const shortNativeBlockchain = utils.helpers.getBlockchainShortType(this.nativeBlockchain)
      const shortHostBlockchain = utils.helpers.getBlockchainShortType(this.hostBlockchain)

      const nativeTxId = await utils[shortNativeBlockchain].monitorUtxoByAddress(
        this.nativeNetwork,
        this.value,
        promiEvent.eventEmitter,
        POLLING_TIME,
        'nativeTxBroadcasted',
        'nativeTxConfirmed',
        confirmations[shortNativeBlockchain]
      )

      const broadcastedHostTxReport = await this.node.monitorIncomingTransaction(nativeTxId, promiEvent.eventEmitter)
      const hostTxReceipt = await utils[shortHostBlockchain].waitForTransactionConfirmation(
        this.hostApi,
        broadcastedHostTxReport.broadcast_tx_hash,
        HOST_NODE_POLLING_TIME_INTERVAL
      )

      if (this.hostBlockchain !== utils.constants.blockchains.Telos) {
        // NOTE: 'onEosTxConfirmed & onEthTxConfirmed' will be removed in version >= 1.0.0
        promiEvent.eventEmitter.emit(hostBlockchainEvents[this.hostBlockchain], hostTxReceipt)
      }
      promiEvent.eventEmitter.emit('hostTxConfirmed', hostTxReceipt)

      promiEvent.resolve({
        amount: utils.eth.offChainFormat(new BigNumber(broadcastedHostTxReport.host_tx_amount), 8).toFixed(),
        nativeTx: nativeTxId,
        hostTx: broadcastedHostTxReport.broadcast_tx_hash,
        to: this.hostAddress
      })
    }

    start()
    return promiEvent.eventEmitter
  }
}
