import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
// import qrcode from 'qrcode-terminal'

const ARBITRUM_TESTING_ADDRESS = ''
const ARBITRUM_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_ADDRESS = ''
const WEB3_PROVIDER = ''

jest.setTimeout(3000000)

let pbtc
beforeEach(() => {
  pbtc = new pBTC({
    blockchain: constants.blockchains.Arbitrum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ARBITRUM_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
})

test('Should get a BTC deposit address on Arbitrum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'
  const depositAddress = await pbtc.getDepositAddress(ARBITRUM_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pbtc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a BTC deposit address because of invalid Eth address', async () => {
  const invalidEthAddress = 'Invalid Eth Address'
  try {
    await pbtc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid host account')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on Arbitrum', async () => {
  const amountToIssue = 50100
  const minerFees = 1000
  const depositAddress = await pbtc.getDepositAddress(ARBITRUM_TESTING_ADDRESS)

  // if you want for example send btc from a phone
  /* qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  }) */

  await sendBitcoin(BTC_TESTING_PRIVATE_KEY, BTC_TESTING_ADDRESS, amountToIssue, minerFees, depositAddress.toString())

  let btcTxIsBroadcasted = false
  let btcTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let arbitrumTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('nativeTxBroadcasted', () => {
          btcTxIsBroadcasted = true
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          arbitrumTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(arbitrumTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.0005 pBTC on Arbitrum', async () => {
  const amountToRedeem = BigNumber(0.0005)
    .multipliedBy(10 ** 18)
    .toFixed()
  let arbitrumTxBroadcasted = false
  let arbitrumTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let btcTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('hostTxBroadcasted', () => {
          arbitrumTxBroadcasted = true
        })
        .once('hostTxConfirmed', () => {
          arbitrumTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()

  expect(arbitrumTxBroadcasted).to.equal(true)
  expect(arbitrumTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
})
