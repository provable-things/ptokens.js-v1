import { Node, Report } from 'ptokens-node'
import {
  LitecoinUtxo,
  LitecoinTransactionReceipt
} from 'ptokens-utils'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'

export interface pLTCConfigs {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  ethPrivateKey?: string,
  ethProvider?: string | object,
  eosPrivateKey?: string,
  eosRpc?: string | JsonRpc,
  eosSignatureProvider?: JsSignatureProvider
  defaultEndpoint?: string
}

export interface RedeemOptions {
  gas?: number,
  gasPrice?: number | string | BigNumber
}

export class pLTC extends NodeSelector {
  constructor(configs: pLTCConfigs)

  nodeSelector: NodeSelector

  decimals: string | null

  contractAddress: string | null

  hostPrivatekey?: string | null

  hostApi?: Web3 | Api

  getDepositAddress(_hostAddress: string): Promise<LtcDepositAddress>

  redeem(_amount: number, _ltcAddress: string, _options: RedeemOptions): PromiEvent<TransactionReceipt | Report | LitecoinTransactionReceipt | RedeemResult>
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
  hostNetwork: string,
  hostApi?: Web3 | Api
  hostBlockchain: string,
  node: Node
}

export class LtcDepositAddress {
  constructor(configs: BtcDepositAddressConfigs)

  hostBlockchain: string

  hostNetwork: string

  nativeBlockchain: string

  nativeNetwork: string

  node: Node

  hostApi?: Web3 | Api

  hostAddress: string | null

  nonce: number | null

  enclavePublicKey: string | null

  value: string | null

  generate(_hostAddress: string): Promise<string>

  toString(): string

  verify(): boolean

  waitForDeposit(): PromiEvent<TransactionReceipt | Report | LitecoinUtxo | IssueResult>
}
