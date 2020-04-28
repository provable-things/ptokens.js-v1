import { EventEmitter } from 'events'
import { TransactionReceipt } from 'web3-core'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import Web3 from 'web3'

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

export interface BtcUtilsInterface {
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
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number): Promise<BitcoinTransactionReceipt>
}

export const btc: BtcUtilsInterface

// converters
export interface ConvertersInterface {
  decodeUint64le(_buffer: Buffer): number
  encodeUint64le(_number: number): Buffer
}

export const converters: ConvertersInterface

// eth
export interface ContractCallParam {
  abi: any, // difficult to get abi interface
  contractAddress: string,
  value?: number,
}

export interface EthUtilsInterface {
  addHexPrefix(_string: string): string
  removeHexPrefix(_string: string): string
  correctFormat(_amount: number, _decimals: number, _operation: string): number
  getAccount(_web3: Web3, _isWeb3Injected: boolean): string
  getContract(_web3: Web3, _abi: any, _contractAddress: string, _account: string): object
  getGasLimit(_web3: Web3): number
  isHexPrefixed(_string: string): boolean
  makeContractCall(_web3: Web3, _method: string, _options: ContractCallParam, _params: Array<number | string>): Promise<TransactionReceipt>
  makeContractSend(_web3: Web3, _method: string, _options: ContractCallParam, _params: Array<number | string>): Promise<TransactionReceipt>
  waitForTransactionConfirmation(_web3: Web3, _tx: string, _pollingTime: number): Promise <TransactionReceipt>
}

export const eth: EthUtilsInterface

// eos
export interface EosUtilsInterface {
  getApi(_privateKey: string, _rpc: string | JsonRpc, _signatureProvider: JsSignatureProvider | null): Api
  getAccountName(_rpc: JsonRpc, _pubkeys: string[]): Promise<string>
  getAvailablePublicKeys(_signatureProvider: JsSignatureProvider): Promise<string[]>
  getAmountInEosFormat(_amount: number, _decimals: number): number
  isValidAccountName(_accountName: string): boolean
  transferNativeToken(_api: Api, _to: string, _accountName: string, _amount: number, _memo: string, _blocksBehind: number, _expireSeconds: number): Promise<any>
  waitForTransactionConfirmation(_api: Api, _tx: string): Promise<any>
}

export const eos: EosUtilsInterface

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

export interface Blockchains {
  Bitcoin: string,
  Ethereum: string,
  Eosio: string
}

export interface Networks {
  BitcoinMainnet: string,
  BitcoinTestnet: string,
  EthereumMainnet: string,
  EthereumRopsten: string,
  EosioMainnet: string,
  EosioJungle: string
}

export interface pTokens {
  pBTC: string
}

export interface HelpersInterface {
  parseParams(_params: object, _nativeBlockchain: string): ParsedParams
  getBlockchainType(_blockchain: string): string
  getBlockchainShortType(_blockchain: string): string
  getNetworkType(_network: string): string
  getNativeBlockchainFromPtokenName(_name: string): string
  isValidPTokenName(_name: string): boolean,
  blockchains: Blockchains
  networks: Networks,
  pTokens: pTokens
}

export const helpers: HelpersInterface
