import utils from '../src'
import EventEmitter from 'eventemitter3'
import { expect } from 'chai'

jest.setTimeout(30000)

const UTXO = '02aa5b687d4ea0d5d2bce9801d525692322e0e4ed073a82001f2e3f8b6fb1a05'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

test('Should be a VALID BTC address', () => {
  const validBtcAddress = BTC_TESTING_ADDRESS
  const result = utils.btc.isValidAddress(validBtcAddress)
  expect(result).to.be.equal(true)
})

test('Should be an INVALID BTC address', () => {
  const invalidBtcAddress = 'invalid'
  const result = utils.btc.isValidAddress(invalidBtcAddress)
  expect(result).to.be.equal(false)
})

test('Should monitor a BTC utxo given an address', async () => {
  const eventEmitter = new EventEmitter()
  const pollingTime = 200
  const network = 'testnet'
  const broadcastEventName = 'nativeTxBroadcasted'
  const confirmationEventName = 'nativeTxConfirmed'

  let btcTxBroadcasted = 0
  let btcTxConfirmed = 0
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onBtcTxBroadcasted', () => {
        btcTxBroadcasted += 1
      })
      eventEmitter.once(broadcastEventName, () => {
        btcTxBroadcasted += 1
      })
      eventEmitter.once('onBtcTxConfirmed', () => {
        btcTxConfirmed += 1
      })
      eventEmitter.once(confirmationEventName, () => {
        btcTxConfirmed += 1
      })

      utils.btc
        .monitorUtxoByAddress(
          network,
          BTC_TESTING_ADDRESS,
          eventEmitter,
          pollingTime,
          broadcastEventName,
          confirmationEventName
        )
        .then(() => resolve())
    })

  await start()

  expect(btcTxBroadcasted).to.be.equal(2)
  expect(btcTxConfirmed).to.be.equal(2)
})

test('Should monitor a BTC transaction confirmation', async () => {
  const pollingTime = 200
  const network = 'testnet'

  const receipt = await utils.btc.waitForTransactionConfirmation(
    network,
    UTXO,
    pollingTime
  )

  expect(receipt).to.be.an('object')
})

test('Should get all BTC utxo given an address', async () => {
  const network = 'testnet'
  const utxos = await utils.btc.getUtxoByAddress(network, BTC_TESTING_ADDRESS)
  expect(utxos).to.be.an('Array')
})

test('Should get a BTC tx in hex format', async () => {
  const network = 'testnet'
  const hex = await utils.btc.getTransactionHexById(network, UTXO)
  expect(hex).to.be.a('String')
})
