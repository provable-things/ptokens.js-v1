import { Node, Report } from 'ptokens-node'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import BN = require('bn.js')

export interface pBEP20Configs {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  ethPrivateKey?: string,
  ethProvider?: string | object,
  polygonPrivateKey?: string,
  polygonProvider?: string | object,
  bscPrivateKey?: string,
  bscProvider?: string | object,
  defaultNode?: Node,
  pToken: string
}

export interface IssueOptions {
  gas: number,
  gasPrice: number | string | BigNumber,
}

export interface RedeemOptions {
  gasPrice: number | string | BigNumber,
  gas: string | number
}

export class pBEP20 extends NodeSelector {
  constructor(configs: pBEP20Configs)

  nodeSelector: NodeSelector

  decimals: string | null

  nativeContractAddress: string | null

  hostContractAddress: string | null

  nativeVaultAddress: string | null

  hostPrivatekey?: string | null

  web3: Web3

  hostApi?: Web3

  issue(_amount: string | BigNumber | BN, _hostAddress: string, _options: IssueOptions): PromiEvent<object | TransactionReceipt | Report | Result>

  redeem(_amount: number | string, _nativeAddress: string, _options: RedeemOptions): PromiEvent<object | Report | TransactionReceipt | Result>
}

export interface Result {
  amount: number,
  nativeTx: string,
  hostTx: string,
  to: string,
}
