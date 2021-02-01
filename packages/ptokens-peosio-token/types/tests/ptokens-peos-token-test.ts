import { pEosioToken } from 'ptokens-peosio-token'

const peos = new pEosioToken({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType PromiEvent<object | TransactionReceipt | Report | Result>
peos.issue('0.0015', '0xdf3B180694aB22C577f7114D822D28b92cadFd75')

// $ExpectType PromiEvent<object | TransactionReceipt | Report | Result>
peos.redeem(10, 'eosxxxx', {
  gas: 10,
  gasPrice: 10
})
