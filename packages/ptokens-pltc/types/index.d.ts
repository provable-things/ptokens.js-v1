import { Node, Report } from 'ptokens-node'
import {
  EthereumTransactionReceipt,
  LitecoinUtxo,
  LitecoinTransactionReceipt
} from 'ptokens-utils'
import { PromiEvent } from 'web3-core'
import { NodeSelector } from 'ptokens-node-selector'

export interface Configs {
  ethPrivateKey?: string,
  ethProvider: string,
  ltcNetwork: string,
  defaultEndpoint?: string
}

export class pLTC {
  constructor(configs: Configs)

  nodeSelector: NodeSelector

  getDepositAddress(_ethAddress: string): Promise<LtcDepositAddress>

  redeem(_amount: number, _ltcAddress: string): PromiEvent<EthereumTransactionReceipt | Report | LitecoinTransactionReceipt | RedeemResult>

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
  amount: number,
  to: string,
  tx: string
}

export interface LtcDepositAddressConfigs {
  network: string,
  node: Node,
  web3: object
}

export class LtcDepositAddress {
  constructor(configs: LtcDepositAddressConfigs)

  ethAddress: string | null

  nonce: number | null

  enclavePublicKey: string | null

  value: string | null

  generate(_ethAddress: string): Promise<string>

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<EthereumTransactionReceipt | Report | LitecoinUtxo | IssueResult>
}
