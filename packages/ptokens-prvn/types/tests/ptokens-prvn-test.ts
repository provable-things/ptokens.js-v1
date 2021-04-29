import { pRVN } from 'ptokens-prvn'

const prvn = new pRVN({
  network: 'mainnet',
  blockchain: 'eth'
})

// $ExpectType Promise<DepositAddress>
prvn.getDepositAddress('eth address')

// $ExpectType PromiEvent<string | TransactionReceipt | Report | RavencoinTransactionReceipt | RedeemResult>
prvn.redeem(10, 'rvn address', {
  gas: 10,
  gasPrice: 10
})
