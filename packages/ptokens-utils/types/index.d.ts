import { EventEmitter } from 'events'

// btc
export interface BitcoinUtxoList extends Array<BitcoinUtxo> {}

export interface BitcoinTransactionStatus {
  confirmed: boolean,
  block_height: number,
  block_hash: string,
  block_time: number
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

export interface btcInterface {
  broadcastTransaction(_network: string, _tx: string): Promise<BitcoinBroadcastedTx>
  getUtxoByAddress(_network: string, _address: string): Promise<BitcoinUtxoList>
  getTransactionHexById(_network: string, _txId: string): Promise<string>
  isValidAddress(_address: string): boolean
  monitorUtxoByAddress(
    _network: string,
    _address: string,
    _eventEmitter: EventEmitter,
    _pollingTime: number
  ): Promise<BitcoinUtxoList>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number): Promise<boolean>
}

export const btc: btcInterface

// converters
export interface convertersInterface {
  decodeUint64le(_buffer: Buffer): number
  encodeUint64le(_number: number): Buffer
}

export const converters: convertersInterface

// eth
export interface EthereumTransactionReceipt {
  hash: string,
  nonce: number,
  blockHash: string | null,
  blockNumber: number | null,
  transactionIndex: number | null,
  from: string,
  to: string | null,
  value: string,
  gasPrice: string,
  gas: number,
  input: string
}

export interface ContractCallParam {
  abi: any, // difficult to get abi interface
  contractAddress: string,
  value?: number,
}

export interface ethInterface {
  addHexPrefix(_string: string): string
  removeHexPrefix(_string: string): string
  correctFormat(_amount: number, _decimals: number, _operation: string): number
  getAccount(_web3: object, _isWeb3Injected: boolean): string
  getContract(_web3: object, _abi: any, _contractAddress: string, _account: string): object
  getGasLimit(_web3: object): number
  isHexPrefixed(_string: string): boolean
  makeContractCall(_web3: object, _method: string, _options: ContractCallParam, _params: Array<number | string>): Promise<EthereumTransactionReceipt>
  makeContractSend(_web3: object, _method: string, _options: ContractCallParam, _params: Array<number | string>): Promise<EthereumTransactionReceipt>
  waitForTransactionConfirmation(_web3: object, _tx: string, _pollingTime: number): Promise <EthereumTransactionReceipt>
}

export const eth: ethInterface

// helpers
export interface pToken {
  name: string,
  redeemFrom: string
}

export interface helpersInterface {
  pTokenNameIsValid(_pTokenName: string): boolean
  pTokenIsValid(_pToken: pToken): boolean
}

export const helpers: helpersInterface

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

export interface ltcInterface {
  broadcastTransaction(_network: string, _tx: string): Promise<LitecoinBroadcastedTx>
  getUtxoByAddress(_network: string, _address: string): Promise<LitecoinUtxoList>
  getTransactionHexById(_network: string, _txId: string): Promise<string>
  isValidAddress(_network: string, _address: string): boolean
  monitorUtxoByAddress(
    _network: string,
    _address: string,
    _eventEmitter: EventEmitter,
    _pollingTime: number
  ): Promise <LitecoinUtxoList>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number): Promise<boolean>
}

export const ltc: ltcInterface
