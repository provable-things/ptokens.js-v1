import { Node, Report } from 'ptokens-node'
import {
  EthereumTransactionReceipt,
  LitecoinUtxo,
  LitecoinTransactionReceipt
} from 'ptokens-utils'
import { PromiEvent } from 'web3-core'

export interface Configs {
  ethPrivateKey?: string,
  ethProvider: string,
  ltcNetwork: string,
  defaultNode?: string
}

export class pLTC {
  constructor(configs: Configs)

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
  amount?: number,
  to: string,
  tx: string
}

export class LtcDepositAddress {
  constructor(
    configs: {
      ethAddress: string,
      nonce: number,
      enclavePublicKey: string,
      value: string,
      ltcNetwork: string,
      node: Node,
      web3: object
    }
  )

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<EthereumTransactionReceipt | Report | LitecoinUtxo | IssueResult>
}
