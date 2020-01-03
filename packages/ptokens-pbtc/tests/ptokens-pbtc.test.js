import pBTC from '../src/index'
import { expect } from 'chai'
import { PBTC_TOKEN_DECIMALS } from '../src/utils/constants'

const configs = {
  ethPrivateKey: '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742',
  ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6'
}
// corresponsing eth address = 0xdf3B180694aB22C577f7114D822D28b92cadFd75

const ETH_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

jest.setTimeout(3000000)

test('Should get a BTC deposit address', async () => {
  const pbtc = new pBTC({
    btcNetwork: 'testnet'
  })

  const address = await pbtc.getDepositAddress(ETH_ADDRESS)
  expect(address)
    .to.be.a('string')
})

test('Should not get a BTC deposit address because of invalid Eth address', async () => {
  const pbtc = new pBTC({
    btcNetwork: 'testnet'
  })

  const invalidEthAddress = 'Invalid Eth Address'

  try {
    await pbtc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Eth Address is not valid')
  }
})