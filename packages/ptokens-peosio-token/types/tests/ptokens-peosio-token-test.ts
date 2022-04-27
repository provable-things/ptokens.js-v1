import { pEosioToken } from 'ptokens-peosio-token'

const peos = new pEosioToken({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
peos.issue('0.0015', '0xdf3B180694aB22C577f7114D822D28b92cadFd75', {
  blocksBehind: 30,
  expireSecond: 120,
  permission: 'active',
  actor: 'actor'
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
peos.redeem(10, 'eosxxxx', {
  gas: 10,
  gasPrice: 10
})
