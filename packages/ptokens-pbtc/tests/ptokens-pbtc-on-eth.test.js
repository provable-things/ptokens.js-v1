import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
// import qrcode from 'qrcode-terminal'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_ADDRESS = ''
const WEB3_PROVIDER = ''

jest.setTimeout(3000000)

let pbtc
beforeEach(() => {
  pbtc = new pBTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
})

test('Should get a BTC deposit address on Ethereum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'
  const depositAddress = await pbtc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pbtc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a BTC deposit address because of invalid Eth address', async () => {
  const invalidEthAddress = 'Invalid Eth Address'
  try {
    await pbtc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid Ethereum Address')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on Ethereum', async () => {
  const amountToIssue = 50100
  const minerFees = 1000
  const depositAddress = await pbtc.getDepositAddress(ETH_TESTING_ADDRESS)

  // if you want for example send btc from a phone
  /* qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  }) */

  await sendBitcoin(BTC_TESTING_PRIVATE_KEY, BTC_TESTING_ADDRESS, amountToIssue, minerFees, depositAddress.toString())

  let btcTxIsBroadcasted = 0
  let btcTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let ethTxIsConfirmed = 0
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onBtcTxBroadcasted', () => {
          btcTxIsBroadcasted += 1
        })
        .once('nativeTxBroadcasted', () => {
          btcTxIsBroadcasted += 1
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(ethTxIsConfirmed).to.equal(2)
})

test('Should redeem 0.0005 pBTC on Ethereum', async () => {
  const amountToRedeem = BigNumber(0.0005)
    .multipliedBy(10 ** 18)
    .toFixed()
  let ethTxBroadcasted = 0
  let ethTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let btcTxIsConfirmed = 0
  const start = () =>
    new Promise((resolve, reject) => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('hostTxBroadcasted', () => {
          ethTxBroadcasted += 1
        })
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('onNodeReceivedTx', e => {
          nodeHasReceivedTx += 1
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()

  expect(ethTxBroadcasted).to.equal(1)
  expect(ethTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
})
