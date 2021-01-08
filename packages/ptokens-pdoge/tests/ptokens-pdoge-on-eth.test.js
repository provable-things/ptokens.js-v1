import { pDOGE } from '../src/index'
import { expect } from 'chai'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import qrcode from 'qrcode-terminal'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const WEB3_PROVIDER = ''
const DOGE_TESTING_ADDRESS = ''

jest.setTimeout(3000000)

let pdoge
beforeEach(() => {
  pdoge = new pDOGE({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
})

test('Should get a LTC deposit address on Ethereum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'
  const depositAddress = await pdoge.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pdoge.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a LTC deposit address because of invalid Eth address', async () => {
  const invalidEthAddress = 'Invalid Eth Address'
  try {
    await pdoge.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid Ethereum Address')
  }
})

test('Should monitor an issuing of 0.001 pDOGE on Ethereum', async () => {
  const depositAddress = await pdoge.getDepositAddress(ETH_TESTING_ADDRESS)

  qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  })

  let dogeTxIsBroadcasted = false
  let dogeTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('nativeTxBroadcasted', () => {
          dogeTxIsBroadcasted = true
        })
        .once('nativeTxConfirmed', () => {
          dogeTxIsConfirmed = true
        })
        .once('nodeReceivedTx', e => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(dogeTxIsBroadcasted).to.equal(true)
  expect(dogeTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should monitoring a redeem of 0.001 pDOGE on Ethereum', async () => {
  const amountToRedeem = BigNumber(0.001).multipliedBy(10 ** 18)
  let ethTxBroadcasted = false
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let dogeTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      pdoge
        .redeem(amountToRedeem, DOGE_TESTING_ADDRESS, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('hostTxBroadcasted', () => {
          ethTxBroadcasted += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('nativeTxConfirmed', e => {
          dogeTxIsConfirmed += 1
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(ethTxBroadcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(dogeTxIsConfirmed).to.equal(true)
})
