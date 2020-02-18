import { pLTC, LtcDepositAddress } from 'ptokens-pltc'
import { Node } from 'ptokens-node'
import Web3 from 'web3'

const web3 = new Web3()

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const ETH_TESTING_ADDRESS_2 = '0xaC248Dd1e6021b98556CDC4B463c34AeAaa1ed3A'
const LTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pltc = new pLTC({
  ethPrivateKey:
    '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742',
  ethProvider: 'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6',
  ltcNetwork: 'testnet'
})

// $ExpectType Promise<LtcDepositAddress>
pltc.getDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType PromiEvent<EthereumTransactionReceipt | Report | LitecoinTransactionReceipt | RedeemResult>
pltc.redeem(10, LTC_TESTING_ADDRESS)

// $ExpectType Promise<number>
pltc.getTotalIssued()

// $ExpectType Promise<number>
pltc.getTotalRedeemed()

// $ExpectType Promise<number>
pltc.getCirculatingSupply()

// $ExpectType Promise<number>
pltc.getBalance(ETH_TESTING_ADDRESS)

// $ExpectType Promise<boolean>
pltc.transfer(ETH_TESTING_ADDRESS, 10)

// $ExpectType Promise<boolean>
pltc.approve(ETH_TESTING_ADDRESS, 10)

// $ExpectType Promise<boolean>
pltc.transferFrom(ETH_TESTING_ADDRESS, ETH_TESTING_ADDRESS_2, 10)

// $ExpectType Promise<number>
pltc.getBurnNonce()

// $ExpectType Promise<number>
pltc.getMintNonce()

// $ExpectType Promise<number>
pltc.getAllowance(ETH_TESTING_ADDRESS, ETH_TESTING_ADDRESS_2)

const node = new Node({
  pToken: {
    name: 'pLTC',
    redeemFrom: 'ETH'
  }
})

const ltcDepositAddress = new LtcDepositAddress({
  ethAddress: ETH_TESTING_ADDRESS,
  nonce: 10,
  enclavePublicKey: 'enc pub key',
  value: LTC_TESTING_ADDRESS,
  ltcNetwork: 'testnet',
  node,
  web3
})

// $ExpectType string
ltcDepositAddress.toString()

// $ExpectType boolean
ltcDepositAddress.verify()

// $ExpectType PromiEvent<EthereumTransactionReceipt | Report | LitecoinUtxo | IssueResult>
ltcDepositAddress.waitForDeposit()
