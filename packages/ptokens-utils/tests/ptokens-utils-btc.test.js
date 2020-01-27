import utils from '../src'
import EventEmitter from 'eventemitter3'
import { expect } from 'chai'

jest.setTimeout(30000)

const UTXO = '02aa5b687d4ea0d5d2bce9801d525692322e0e4ed073a82001f2e3f8b6fb1a05'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

test('Should be a VALID BTC address', () => {
  const validBtcAddress = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'
  const result = utils.btc.isValidAddress(validBtcAddress)
  expect(result.address)
    .to.be.equal(validBtcAddress)
})

test('Should be an INVALID BTC address', () => {
  const validBtcAddress = 'invalid'
  const result = utils.btc.isValidAddress(validBtcAddress)
  expect(result)
    .to.be.equal(false)
})

test('Should monitor an utxo given an address', async () => {
  const eventEmitter = new EventEmitter()
  const pollingTime = 200
  const network = 'testnet'

  let isBtcTxBroadcasted = false
  let isBtcTxConfirmed = false
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onBtcTxBroadcasted', () => { isBtcTxBroadcasted = true })
      eventEmitter.once('onBtcTxConfirmed', () => { isBtcTxConfirmed = true })

      utils.btc.monitorUtxoByAddress(
        network,
        BTC_TESTING_ADDRESS,
        eventEmitter,
        pollingTime
      )
        .then(() => resolve())
    })

  await start()

  expect(isBtcTxBroadcasted).to.be.equal(true)
  expect(isBtcTxConfirmed).to.be.equal(true)
})

test('Should monitor a transaction confirmation', async () => {
  const eventEmitter = new EventEmitter()
  const pollingTime = 200
  const network = 'testnet'

  let isBtcTxConfirmed = false
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onBtcTxConfirmed', () => { isBtcTxConfirmed = true })

      utils.btc.monitorTransactionConfirmation(
        network,
        UTXO,
        eventEmitter,
        pollingTime
      )
        .then(() => resolve())
    })

  await start()

  expect(isBtcTxConfirmed).to.be.equal(true)
})

test('Should get all utxo given an address', async () => {
  const network = 'testnet'
  const utxos = await utils.btc.getUtxoByAddress(
    network,
    BTC_TESTING_ADDRESS
  )
  expect(utxos).to.be.an('Array')
})
