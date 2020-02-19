import { EventEmitter } from 'events'

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
  ): Promise<string>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number): Promise<BitcoinTransactionReceipt>
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
  ): Promise <string>
  waitForTransactionConfirmation(_network: string, _tx: string, _pollingTime: number): Promise<LitecoinTransactionReceipt>
}

export const ltc: ltcInterface
