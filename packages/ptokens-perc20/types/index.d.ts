import { Node, Report } from 'ptokens-node'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { NodeSelector } from 'ptokens-node-selector'
import { BigNumber } from 'bignumber.js'
import BN = require('bn.js')

export interface pERC20Configs {
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
  defaultNode?: Node,
  pToken: string
}

export interface Options {
  gas?: number,
  gasPrice?: number | string | BigNumber
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

  hostPrivatekey?: string | null

  web3: Web3

  hostApi?: Api

  issue(_amount: string | BigNumber | BN, _hostAddress: string, _options?: Options): PromiEvent<object | TransactionReceipt | Report | Result>

  redeem(_amount: number | string, _nativeAddress: string): PromiEvent<object | Report | TransactionReceipt | Result>
}

export interface Result {
  amount: number,
  nativeTx: string,
  hostTx: string,
  to: string,
}
