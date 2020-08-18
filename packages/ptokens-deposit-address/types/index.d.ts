import { Report, Node } from 'ptokens-node'
import Web3 from 'web3'
import { Api } from 'eosjs'
import { TransactionReceipt, PromiEvent } from 'web3-core'
import { BitcoinUtxo, LitecoinUtxo} from 'ptokens-utils'

export interface DepositAddressConfigs {
  hostNetwork: string,
  hostApi?: Web3 | Api
  hostBlockchain: string,
  node: Node
}

export class DepositAddress {
  constructor(configs: DepositAddressConfigs)

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

  waitForDeposit(): PromiEvent<TransactionReceipt | Report | BitcoinUtxo | LitecoinUtxo | IssueResult>
}

export interface IssueResult {
  amount: number,
  to: string,
  tx: string
}
