import { DepositAddress } from 'ptokens-deposit-address'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'
import Web3 from 'web3'

const node = new Node({
  pToken: 'pBTC',
  blockchain: 'eth',
  provider: new HttpProvider()
})

const depositAddress = new DepositAddress({
  hostNetwork: 'ropsten_testnet',
  hostApi: new Web3(),
  hostBlockchain: 'eth',
  node
})

// $ExpectType Promise<string>
depositAddress.generate("eth address")

// $ExpectType string
depositAddress.toString()

// $ExpectType boolean
depositAddress.verify()

// $ExpectType PromiEvent<TransactionReceipt | Report | BitcoinUtxo | LitecoinUtxo | IssueResult>
depositAddress.waitForDeposit()
