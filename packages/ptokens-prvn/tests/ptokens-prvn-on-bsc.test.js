import { pRVN } from '../src/index'
import { expect } from 'chai'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
// import qrcode from 'qrcode-terminal'

const BSC_TESTING_ADDRESS = ''
const BSC_TESTING_PRIVATE_KEY = ''
const RVN_TESTING_ADDRESS = ''
const WEB3_PROVIDER = ''

jest.setTimeout(3000000)

let prvn
beforeEach(() => {
  prvn = new pRVN({
    blockchain: constants.blockchains.BinanceSmartChain,
    network: constants.networks.Mainnet,
    bscPrivateKey: BSC_TESTING_PRIVATE_KEY,
    bscProvider: WEB3_PROVIDER
  })
})

test('Should get a RVN deposit address on Binance Smart Chain Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'
  const depositAddress = await prvn.getDepositAddress(BSC_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(prvn.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a RVN deposit address because of invalid Binance Smart Chain address', async () => {
  try {
    await prvn.getDepositAddress('invalid address')
  } catch (err) {
    expect(err.message).to.be.equal('Invalid Binance Smart Chain Address')
  }
})

test('Should monitor an issuing of pRVN on Binance Smart Chain', async () => {
  const depositAddress = await prvn.getDepositAddress(BSC_TESTING_ADDRESS)

  /* qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  }) */

  let rvnTxIsBroadcasted = false
  let rvnTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let bscTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('nativeTxBroadcasted', () => {
          rvnTxIsBroadcasted = true
        })
        .once('nativeTxConfirmed', () => {
          rvnTxIsConfirmed = true
        })
        .once('nodeReceivedTx', e => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          bscTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(rvnTxIsBroadcasted).to.equal(true)
  expect(rvnTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(bscTxIsConfirmed).to.equal(true)
})

test('Should monitoring a redeem of 0.01 pRVN on Binance Smart Chain', async () => {
  const amountToRedeem = BigNumber(0.01).multipliedBy(10 ** 18)
  let bscTxBroadcasted = false
  let bscTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let rvnTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      prvn
        .redeem(amountToRedeem, RVN_TESTING_ADDRESS, {
          gasPrice: 10e9,
          gas: 200000
        })
        .once('hostTxBroadcasted', () => {
          bscTxBroadcasted = true
        })
        .once('hostTxConfirmed', () => {
          bscTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', e => {
          rvnTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(bscTxBroadcasted).to.equal(true)
  expect(bscTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(rvnTxIsConfirmed).to.equal(true)
})
