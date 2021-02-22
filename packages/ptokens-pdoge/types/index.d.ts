import { Node, Report } from 'ptokens-node'
import {
  DogecoinTransactionReceipt
} from 'ptokens-utils'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import { DepositAddress } from 'ptokens-deposit-address'

export interface pDOGEConfigs {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  ethPrivateKey?: string,
  ethProvider?: string | object,
  defaultNode?: Node
}

export interface RedeemOptions {
  gas?: number,
  gasPrice?: number | string | BigNumber
}

export class pDOGE extends NodeSelector {
  constructor(configs: pDOGEConfigs)

  nodeSelector: NodeSelector

  decimals: string | null

  contractAddress: string | null

  hostPrivatekey?: string | null

  hostApi?: Web3

  getDepositAddress(_hostAddress: string): Promise<DepositAddress>

  redeem(_amount: number|string|BigNumber, _ltcAddress: string, _options: RedeemOptions): PromiEvent<string | TransactionReceipt | Report | DogecoinTransactionReceipt | RedeemResult>
}

export interface RedeemResult {
  amount: number,
  nativeTx: string,
  hostTx: string,
  to: string,
}
