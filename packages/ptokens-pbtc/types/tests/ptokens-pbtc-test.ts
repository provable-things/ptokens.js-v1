import { pBTC, BtcDepositAddress } from 'ptokens-pbtc'
import { Node } from 'ptokens-node'
import Web3 from 'web3'

const web3 = new Web3()

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pbtc = new pBTC({
  btcNetwork: 'mainnet',
  hostBlockchain: 'ETH'
})

// $ExpectType Promise<BtcDepositAddress>
pbtc.getDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType PromiEvent<TransactionReceipt | Report | BitcoinTransactionReceipt | RedeemResult>
pbtc.redeem(10, BTC_TESTING_ADDRESS)

const node = new Node({
  pToken: {
    name: 'pBTC',
    hostBlockchain: 'ETH'
  },
  endpoint: 'https://..'
})

const btcDepositAddress = new BtcDepositAddress({
  network: 'testnet',
  node,
  hostProvider: web3
})

// $ExpectType Promise<string>
btcDepositAddress.generate(ETH_TESTING_ADDRESS)

// $ExpectType string
btcDepositAddress.toString()

// $ExpectType boolean
btcDepositAddress.verify()

// $ExpectType PromiEvent<TransactionReceipt | Report | BitcoinUtxo | IssueResult>
btcDepositAddress.waitForDeposit()
