import { Node, Report } from 'ptokens-node'
import {
  BitcoinUtxo,
  BitcoinTransactionReceipt
} from 'ptokens-utils'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Api } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { NodeSelector } from 'ptokens-node-selector'

export interface Configs {
  hostBlockchain: string,
  btcNetwork: string,
  ethPrivateKey?: string,
  ethProvider?: string | object,
  eosPrivateKey?: string,
  eosRpc?: string,
  eosSignatureProvider?: JsSignatureProvider
  defaultEndpoint?: string
}

export class pBTC {
  constructor(configs: Configs)

  nodeSelector: NodeSelector

  hostBlockchain: string

  decimals: string | null

  contractAddress: string | null

  hostPrivatekey: string | null

  hostProvider: Web3 | Api

  getDepositAddress(_hostAddress: string): Promise<BtcDepositAddress>

  redeem(_amount: number, _btcAddress: string): PromiEvent<TransactionReceipt | Report | BitcoinTransactionReceipt | RedeemResult>
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
  hostProvider: Web3
}

export class BtcDepositAddress {
  constructor(configs: BtcDepositAddressConfigs)

  hostAddress: string | null

  nonce: number | null

  enclavePublicKey: string | null

  value: string | null

  generate(_hostAddress: string): Promise<string>

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<TransactionReceipt | Report | BitcoinUtxo | IssueResult>
}
