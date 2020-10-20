import { pERC20 } from 'ptokens-perc20'

const perc20 = new pERC20({
  network: 'mainnet',
  blockchain: 'eos',
  pToken: 'pweth',
  tokenAddress: '0x0000000000000000000000000000000000000000'
})

// $ExpectType PromiEvent<object | TransactionReceipt | Report | Result>
perc20.issue('1000000000000', 'eos account')

// $ExpectType PromiEvent<object | TransactionReceipt | Report | Result>
perc20.redeem(0.002, 'eth address')
