import { pLTC } from 'ptokens-pltc'

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const LTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pltc = new pLTC({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType Promise<DepositAddress>
pltc.getDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType PromiEvent<string | Report | TransactionReceipt | LitecoinTransactionReceipt | RedeemResult>
pltc.redeem(10, LTC_TESTING_ADDRESS, {
  gas: 10,
  gasPrice: 10
})
