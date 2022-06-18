import { pERC20 } from 'ptokens-perc20'

const perc20 = new pERC20({
  network: 'mainnet',
  blockchain: 'eos',
  pToken: 'pweth'
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
perc20.issue('1000000000000', 'eos account', {
  gas: 10,
  gasPrice: 10
})

// $ExpectType PromiEvent<object | Report | TransactionReceipt | Result>
perc20.redeem(0.002, 'eth address', {
  blocksBehind: 30,
  expireSeconds: 120,
  permission: 'active'
})
