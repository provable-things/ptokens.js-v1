import { Node, Report } from 'ptokens-node'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import BN = require('bn.js')

export interface pERC20Configs {
  network?: string
  hostNetwork?: string
  blockchain?: string
  hostBlockchain?: string
  nativeNetwork?: string
  nativeBlockchain?: string
  ethPrivateKey?: string
  ethProvider?: string | object
  ftmPrivateKey?: string
  ftmProvider?: string | object
  bscPrivateKey?: string
  bscProvider?: string | object
  xdaiPrivateKey?: string
  xdaiProvider?: string | object
  eosPrivateKey?: string
  eosRpc?: string | JsonRpc
  eosSignatureProvider?: JsSignatureProvider
  telosPrivateKey?: string
  telosRpc?: string | JsonRpc
  telosSignatureProvider?: JsSignatureProvider
  ultraPrivateKey?: string
  ultraRpc?: string | JsonRpc
  ultraSignatureProvider?: JsSignatureProvider
  defaultNode?: Node
  pToken: string
}

export interface IssueOptions {
  gas: number
  gasPrice: number | string | BigNumber
}

export interface RedeemOptions {
  blocksBehind?: number
  expireSeconds?: number
  permission?: string
  actor?: string
  gasPrice?: string | number
  gas?: string | number
}

/*
  NOTE: EOS transaction receipt has been declared as "any" so it
  is not possible to use it here because would overwrite other types
  causing errors
*/

export class pERC20 extends NodeSelector {
  constructor(configs: pERC20Configs)

  nodeSelector: NodeSelector

  decimals: string | null

  nativeContractAddress: string | null

  hostContractAddress: string | null

  nativeVaultAddress: string | null

  nativePrivatekey?: string | null

  hostPrivatekey?: string | null

  version: string

  web3: Web3

  hostApi?: Api

  issue(
    _amount: string | BigNumber | BN,
    _hostAddress: string,
    _options: IssueOptions
  ): PromiEvent<object | TransactionReceipt | Report | Result>

  issueWithMetadata(
    _amount: string | BigNumber | BN,
    _hostAddress: string,
    _metadata: string,
    _options: IssueOptions
  ): PromiEvent<object | TransactionReceipt | Report | Result>

  redeem(
    _amount: number | string,
    _nativeAddress: string,
    _options: RedeemOptions
  ): PromiEvent<object | Report | TransactionReceipt | Result>

  redeemWithMetadata(
    _amount: number | string,
    _nativeAddress: string,
    _metadata: string,
    _options: RedeemOptions
  ): PromiEvent<object | Report | TransactionReceipt | Result>
}

export interface Result {
  amount: number
  nativeTx: string
  hostTx: string
  to: string
}
