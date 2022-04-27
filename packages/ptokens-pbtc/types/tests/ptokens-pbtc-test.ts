import { pBTC } from 'ptokens-pbtc'

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pbtc = new pBTC({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType Promise<DepositAddress>
pbtc.getDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType PromiEvent<string | Report | TransactionReceipt | BitcoinTransactionReceipt | RedeemResult>
pbtc.redeem(10, BTC_TESTING_ADDRESS, {
  gas: 10,
  gasPrice: 10
})
