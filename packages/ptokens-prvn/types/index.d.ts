import { Report } from 'ptokens-node'
import {
  RavencoinTransactionReceipt
} from 'ptokens-utils'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import { DepositAddress } from 'ptokens-deposit-address'

export interface pRVNConfigs {
  network?: string,
  hostNetwork?: string,
  blockchain?: string,
  hostBlockchain?: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  bscPrivateKey?: string,
  bscProvider?: string | object,
}

export interface RedeemOptions {
  gas?: number,
  gasPrice?: number | string | BigNumber,
}

export class pRVN extends NodeSelector {
  constructor(configs: pRVNConfigs)

  nodeSelector: NodeSelector

  decimals: string | null

  contractAddress: string | null

  hostPrivatekey?: string | null

  hostApi?: Web3

  getDepositAddress(_hostAddress: string): Promise<DepositAddress>

  redeem(_amount: number|string|BigNumber, _ltcAddress: string, _options: RedeemOptions): PromiEvent<string | TransactionReceipt | Report | RavencoinTransactionReceipt | RedeemResult>
}

export interface RedeemResult {
  amount: number,
  nativeTx: string,
  hostTx: string,
  to: string,
}
