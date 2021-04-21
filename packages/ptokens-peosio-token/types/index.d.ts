import { Node, Report } from 'ptokens-node'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import BN = require('bn.js')

export interface pEosioTokenConfigs {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  ethPrivateKey?: string,
  ethProvider?: string | object,
  bscPrivateKey?: string,
  bscProvider?: string | object,
  eosPrivateKey?: string,
  eosRpc?: string | JsonRpc,
  eosSignatureProvider?: JsSignatureProvider,
  telosPrivateKey?: string,
  telosRpc?: string | JsonRpc,
  telosSignatureProvider?: JsSignatureProvider
  defaultNode?: Node
}

export interface RedeemOptions {
  gas: number,
  gasPrice: number | string | BigNumber
}

export interface IssueOptions {
  blocksBehind: number,
  expireSecond: number,
  permission: string
}

export interface Result {
  amount: number,
  nativeTx: string,
  hostTx: string,
  to: string,
}

export class pEosioToken extends NodeSelector {
  constructor(configs: pEosioTokenConfigs)

  decimals: string | null

  nativeContractAddress: string | null

  hostContractAddress: string | null

  nativeVaultAddress: string | null

  nativePrivatekey?: string | null

  hostPrivatekey?: string | null

  nativeApi?: Api

  hostApi?: Web3 | Api

  issue(_amount: string, _hostAddress: string, _options: IssueOptions): PromiEvent<object | TransactionReceipt | Report | Result>

  redeem(_amount: number|string|BigNumber|BN, _account: string, _options: RedeemOptions): PromiEvent<object | TransactionReceipt | Report | Result>
}
