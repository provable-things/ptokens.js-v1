import utils from '../src'
import EventEmitter from 'eventemitter3'
import { expect } from 'chai'

jest.setTimeout(30000)

const UTXO = '6ccb55376f6615ddbc9dca91187f2e3fe9fcd4a3aa2a8a88ca0c5ccb30b891f6'
const LTC_TESTING_ADDRESS = 'n1qkF2NzY1v5Jj41zSJZRVJE1rJDRyoFzs'

test('Should be a VALID LTC testnet address', () => {
  const validLtcTestnetAddress = LTC_TESTING_ADDRESS
  const result = utils.ltc.isValidAddress(validLtcTestnetAddress)
  expect(result).to.be.equal(true)
})

test('Should be a VALID LTC mainnet address', () => {
  const validLtcMainnetAddress = 'MTvnA4CN73ry7c65wEuTSaKzb2pNKHB4n1'
  const result = utils.ltc.isValidAddress(validLtcMainnetAddress)
  expect(result).to.be.equal(true)
})

test('Should be a VALID LTC Segwit bech32 mainnet address', () => {
  const validLtcMainnetAddress = 'ltc1qqgytgeu96lc76v3yyvmyqrm6ru680k0tjayaca'
  const result = utils.ltc.isValidAddress(validLtcMainnetAddress)
  expect(result).to.be.equal(true)
})

test('Should be an INVALID LTC address', () => {
  const invalidLtcAddress = 'invalid'
  const result = utils.ltc.isValidAddress(invalidLtcAddress)
  expect(result).to.be.equal(false)
})

test('Should monitor a LTC utxo given an address', async () => {
  const eventEmitter = new EventEmitter()
  const pollingTime = 500
  const network = 'testnet'

  let isLtcTxBroadcasted = false
  let isLtcTxConfirmed = false
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onLtcTxBroadcasted', () => {
        isLtcTxBroadcasted = true
      })
      eventEmitter.once('onLtcTxConfirmed', () => {
        isLtcTxConfirmed = true
      })

      utils.ltc
        .monitorUtxoByAddress(
          network,
          LTC_TESTING_ADDRESS,
          eventEmitter,
          pollingTime
        )
        .then(() => resolve())
    })

  await start()

  expect(isLtcTxBroadcasted).to.be.equal(true)
  expect(isLtcTxConfirmed).to.be.equal(true)
})

test('Should monitor a LTC transaction confirmation', async () => {
  const pollingTime = 200
  const network = 'testnet'

  const receipt = await utils.ltc.waitForTransactionConfirmation(
    network,
    UTXO,
    pollingTime
  )

  expect(receipt).to.be.an('object')
})

test('Should get all LTC utxo given an address', async () => {
  const network = 'testnet'
  const utxos = await utils.ltc.getUtxoByAddress(network, LTC_TESTING_ADDRESS)
  expect(utxos).to.be.an('Array')
})

test('Should get a LTC tx in hex format', async () => {
  const network = 'testnet'
  const res = await utils.ltc.getTransactionHexById(network, UTXO)
  expect(res.rawtx).to.be.a('String')
})
