import { EventEmitter } from 'events'
import { TransactionReceipt } from 'web3-core'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'

// btc
export interface BitcoinUtxoList extends Array<BitcoinUtxo> {}

export interface BitcoinTransactionStatus {
  confirmed: boolean,
  block_height?: number,
  block_hash?: string,
  block_time?: number
}

export interface BitcoinUtxo {
  txid: string,
  vout: number,
  status: BitcoinTransactionStatus,
  value: number
}

export interface BitcoinBroadcastedTx {
  txid: string
}

export interface BitcoinVin {
  txid: string,
  vout: number,
  prevout: {
    scriptpubkey: string,
    scriptpubkey_asm: string,
    scriptpubkey_type: string,
    scriptpubkey_address: string,
    value: number
  },
  scriptsig: string,
  scriptsig_asm: string,
  is_coinbase: false,
  sequence: number,
  inner_redeemscript_asm: string,
}

export interface BitcoinVout {
  n: number
  scriptPubKey: {
    addresses: string[]
    asm: string,
    hex: string,
    type: string,
  }
  spentHeight: number,
  spentIndex: number,
  spentTxId: string,
  value: number,
}

export interface BitcoinVinList extends Array<BitcoinVin> {}

export interface BitcoinVoutList extends Array<BitcoinVout> {}

export interface BitcoinTransactionReceipt {
  txid: string,
  version: number,
  locktime: number,
  vin: BitcoinVinList,
  vout: BitcoinVoutList
  size: number,
  weight: number,
  fee: number,
  status: BitcoinTransactionStatus
}

export interface BtcUtils {
  broadcastTransaction(_network: string, _tx: string): Promise<BitcoinBroadcastedTx>
  getUtxoByAddress(_network: string, _address: string): Promise<BitcoinUtxoList>
  getTransactionHexById(_network: string, _txId: string): Promise<string>
  isValidAddress(_address: string): boolean
  monitorUtxoByAddress(
    _network: string,
    _address: string,
    _eventEmitter: EventEmitter,
    _pollingTime: number
  ): Promise<string>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number, _broadcastEventName: string, _confirmationEventName: string): Promise<BitcoinTransactionReceipt>
}

export const btc: BtcUtils

// converters
export interface Converters {
  decodeUint64le(_buffer: Buffer): number
  encodeUint64le(_number: number): Buffer
}

export const converters: Converters

// eth
export interface ContractCallParam {
  abi: any, // difficult to get abi interface
  contractAddress: string,
  value?: number,
}

export interface ContractSendParam {
  abi: any, // difficult to get abi interface
  contractAddress: string,
  value?: number,
  privateKey?: string,
  gas?: number,
  gasPrice?: number | string | BigNumber
}

export interface EthUtils {
  addHexPrefix(_string: string): string
  removeHexPrefix(_string: string): string
  correctFormat(_amount: number, _decimals: number, _operation: string): number
  getAccount(_web3: Web3, _isWeb3Injected: boolean): string
  getContract(_web3: Web3, _abi: any, _contractAddress: string, _account: string): object
  getGasLimit(_web3: Web3): number
  isHexPrefixed(_string: string): boolean
  makeContractCall(_web3: Web3, _method: string, _options: ContractCallParam, _params: Array<number | string>): Promise<TransactionReceipt>
  makeContractSend(_web3: Web3, _method: string, _options: ContractSendParam, _params: Array<number | string>): Promise<TransactionReceipt>
  waitForTransactionConfirmation(_web3: Web3, _tx: string, _pollingTime: number): Promise <TransactionReceipt>
}

export const eth: EthUtils

// eos
export interface EosUtils {
  getApi(_privateKey: string, _rpc: string | JsonRpc, _signatureProvider: JsSignatureProvider | null): Api
  getAccountName(_rpc: JsonRpc, _pubkeys: string[]): Promise<string>
  getAvailablePublicKeys(_signatureProvider: JsSignatureProvider): Promise<string[]>
  getAmountInEosFormat(_amount: number, _decimals: number): number
  isValidAccountName(_accountName: string): boolean
  transferNativeToken(_api: Api, _to: string, _accountName: string, _amount: number, _memo: string, _blocksBehind: number, _expireSeconds: number): Promise<any>
  waitForTransactionConfirmation(_api: Api, _tx: string): Promise<any>
}

export const eos: EosUtils

// helpers
export interface Params {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
}

export interface ParsedParams {
  hostNetwork: string,
  hostBlockchain: string,
  nativeNetwork: string,
  nativeBlockchain: string,
}

export interface Helpers {
  parseParams(_params: object, _nativeBlockchain: string): ParsedParams
  getBlockchainType(_blockchain: string): string
  getBlockchainShortType(_blockchain: string): string
  getNetworkType(_network: string): string
  getNativeBlockchainFromPtokenName(_name: string): string
  isValidPTokenName(_name: string): boolean
}

export const helpers: Helpers

// constants
export interface Blockchains {
  Bitcoin: string,
  Litecoin: string,
  Ethereum: string,
  Eosio: string
}

export interface Networks {
  Mainnet: string,
  Testnet: string,
  BitcoinMainnet: string,
  BitcoinTestnet: string,
  LitecoinMainnet: string,
  LitecoinTestnet: string,
  EthereumMainnet: string,
  EthereumRopsten: string,
  EosioMainnet: string,
  EosioJungle3: string
}

export interface pTokens {
  pBTC: string,
  pLTC: string
}

export interface Constants {
  blockchains: Blockchains
  networks: Networks,
  pTokens: pTokens
}

export const constants: Constants

// ltc
export interface LitecoinUtxoList extends Array<LitecoinUtxo> {}

export interface LitecoinUtxo {
  address: string,
  txid: string,
  vout: number
  value: number,
  scriptPubKey: string,
  amount: number,
  satoshis: number,
  height: number,
  confirmations: number
}

export interface LitecoinBroadcastedTx {
  txid: string
}

export interface LitecoinVin {
  addr: string,
  doubleSpentTxID: string | null,
  n: number,
  scriptSig: {
    asm: string,
    hex: string,
  },
  sequence: number
  txid: string
  value: number
  valueSat: number
  vout: number
}

export interface LitecoinVout {
  n: number
  scriptPubKey: {
    addresses: string[],
    asm: string,
    hex: string,
    type: string,
  }
  spentHeight: number,
  spentIndex: number,
  spentTxId: string,
  value: number,
}

export interface LitecoinVinList extends Array<LitecoinVin> {}

export interface LitecoinVoutList extends Array<LitecoinVout> {}

export interface LitecoinTransactionReceipt {
  blockhash: string,
  blockheight: number,
  blocktime: number,
  confirmations: number,
  fees: number,
  locktime: number,
  size: number,
  time: number,
  txid: string,
  valueIn: number,
  valueOut: number,
  version: number,
  vin: LitecoinVinList
  vout: LitecoinVoutList
}

export interface LtcUtils {
  broadcastTransaction(_network: string, _tx: string): Promise<LitecoinBroadcastedTx>
  getUtxoByAddress(_network: string, _address: string): Promise<LitecoinUtxoList>
  getTransactionHexById(_network: string, _txId: string): Promise<string>
  isValidAddress(_network: string, _address: string): boolean
  monitorUtxoByAddress(
    _network: string,
    _address: string,
    _eventEmitter: EventEmitter,
    _pollingTime: number
  ): Promise <string>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number, _broadcastEventName: string, _confirmationEventName: string): Promise<LitecoinTransactionReceipt>
}

export const ltc: LtcUtils
