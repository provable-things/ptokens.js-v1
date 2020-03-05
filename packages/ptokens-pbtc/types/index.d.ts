import { Node, Report } from 'ptokens-node'
import {
  EthereumTransactionReceipt,
  BitcoinUtxo,
  BitcoinTransactionReceipt
} from 'ptokens-utils'
import { PromiEvent } from 'web3-core'
import { NodeSelector } from 'ptokens-node-selector'

export interface Configs {
  ethPrivateKey?: string,
  ethProvider: string,
  btcNetwork: string,
  defaultEndpoint?: string
}

export class pBTC {
  constructor(configs: Configs)

  nodeSelector: NodeSelector

  getDepositAddress(_ethAddress: string): Promise<BtcDepositAddress>

  redeem(_amount: number, _btcAddress: string): PromiEvent<EthereumTransactionReceipt | Report | BitcoinTransactionReceipt | RedeemResult>
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

export interface BtcDepositAddressConfigs {
  network: string,
  node: Node,
  web3: object
}

export class BtcDepositAddress {
  constructor(configs: BtcDepositAddressConfigs)

  ethAddress: string | null

  nonce: number | null

  enclavePublicKey: string | null

  value: string | null

  generate(_ethAddress: string): Promise<string>

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<EthereumTransactionReceipt | Report | BitcoinUtxo | IssueResult>
}
