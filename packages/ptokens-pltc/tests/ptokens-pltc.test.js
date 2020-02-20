import { pLTC } from '../src/index'
import { expect } from 'chai'
import { sendLitecoin } from './utils'

const configs = {
  ethPrivateKey:
    '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742',
  ethProvider: 'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6',
  ltcNetwork: 'testnet'
}
// corresponsing eth address = 0xdf3B180694aB22C577f7114D822D28b92cadFd75

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

const LTC_TESTING_PRIVATE_KEY =
  '8d31f05cbb64ebb1986f64f70959b8cdcb528c2b095d617fd0bbf1e5c0f7ec07'
const LTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

jest.setTimeout(3000000)

test('Should get a LTC deposit address', async () => {
  const pltc = new pLTC({
    ltcNetwork: 'testnet'
  })

  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a LTC deposit address because of invalid Eth address', async () => {
  const pltc = new pLTC({
    ltcNetwork: 'testnet'
  })

  const invalidEthAddress = 'Invalid Eth Address'

  try {
    await pltc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Eth Address is not valid')
  }
})

test('Should monitor an issuing of 0.005 pLTC', async () => {
  const pltc = new pLTC(configs)

  const amountToIssue = 500
  const minerFees = 50000

  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)

  await sendLitecoin(
    LTC_TESTING_PRIVATE_KEY,
    LTC_TESTING_ADDRESS,
    amountToIssue,
    minerFees,
    depositAddress.toString()
  )

  let ltcTxIsBroadcasted = false
  let ltcTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onLtcTxBroadcasted', () => {
          ltcTxIsBroadcasted = true
        })
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed = true
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(ltcTxIsBroadcasted).to.equal(true)
  expect(ltcTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.0000546 pLTC', async () => {
  const pltc = new pLTC(configs)

  const amountToRedeem = 0.0000546

  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ltcTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      pltc
        .redeem(amountToRedeem, LTC_TESTING_ADDRESS)
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ltcTxIsConfirmed).to.equal(true)
})
