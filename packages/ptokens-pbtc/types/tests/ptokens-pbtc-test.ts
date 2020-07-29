import { pBTC, BtcDepositAddress } from 'ptokens-pbtc'
import { Node } from 'ptokens-node'
import Web3 from 'web3'
import { HttpProvider } from '../../../ptokens-providers/types'

const web3 = new Web3()

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pbtc = new pBTC({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType Promise<BtcDepositAddress>
pbtc.getDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType PromiEvent<TransactionReceipt | Report | BitcoinTransactionReceipt | RedeemResult>
pbtc.redeem(10, BTC_TESTING_ADDRESS, {
  gas: 10,
  gasPrice: 10
})

const node = new Node({
  pToken: 'pBTC',
  blockchain: 'eth',
  provider: new HttpProvider()
})

const btcDepositAddress = new BtcDepositAddress({
  hostNetwork: 'ropsten_testnet',
  hostApi: web3,
  hostBlockchain: 'eth',
  node
})

// $ExpectType Promise<string>
btcDepositAddress.generate(ETH_TESTING_ADDRESS)

// $ExpectType string
btcDepositAddress.toString()

// $ExpectType boolean
btcDepositAddress.verify()

// $ExpectType PromiEvent<TransactionReceipt | Report | BitcoinUtxo | IssueResult>
btcDepositAddress.waitForDeposit()
