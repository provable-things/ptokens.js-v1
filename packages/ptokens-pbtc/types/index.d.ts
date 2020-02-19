import { Node, Report } from 'ptokens-node'
import {
  EthereumTransactionReceipt,
  BitcoinUtxo,
  BitcoinTransactionReceipt
} from 'ptokens-utils'
import { PromiEvent } from 'web3-core'

export interface Configs {
  ethPrivateKey?: string,
  ethProvider: string,
  btcNetwork: string,
  defaultNode?: string
}

export class pBTC {
  constructor(configs: Configs)

  getDepositAddress(_ethAddress: string): Promise<BtcDepositAddress>

  redeem(_amount: number, _btcAddress: string): PromiEvent<EthereumTransactionReceipt | Report | BitcoinTransactionReceipt | RedeemResult>

  getTotalIssued(): Promise<number>

  getTotalRedeemed(): Promise<number>

  getCirculatingSupply(): Promise<number>

  getBalance(_ethAddress: string): Promise<number>

  transfer(_to: string, _amount: number): Promise<boolean>

  approve(_spender: string, _amount: number): Promise<boolean>

  transferFrom(_from: string, _to: string, _amount: number): Promise<boolean>

  getBurnNonce(): Promise<number>

  getMintNonce(): Promise<number>

  getAllowance(_owner: string, _spender: string): Promise<number>
}

export interface RedeemResult {
  amount: number,
  to: string,
  tx: string
}

export interface IssueResult {
  amount?: number,
  to: string,
  tx: string
}

export interface BtcDepositAddressConfigs {
  network: string,
  node: Node,
  web3: object
}

export class BtcDepositAddress {
  constructor(configs: BtcDepositAddressConfigs)

  generate(_ethAddress: string): Promise<string>

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<EthereumTransactionReceipt | Report | BitcoinUtxo | IssueResult>
}
