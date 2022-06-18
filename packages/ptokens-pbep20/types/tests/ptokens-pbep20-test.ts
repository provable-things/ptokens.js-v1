import { pBEP20 } from 'ptokens-pbep20'

const pbep20 = new pBEP20({
  network: 'mainnet',
  blockchain: 'eth',
  pToken: 'ocp'
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
pbep20.issue('1000000000000', 'eos account', {
  gas: 10,
  gasPrice: 10
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
pbep20.redeem(0.002, 'eth address', {
  gas: 10,
  gasPrice: 10
})
