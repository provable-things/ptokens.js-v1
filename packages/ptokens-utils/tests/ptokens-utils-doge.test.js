import utils from '../src'
import EventEmitter from 'eventemitter3'
import { expect } from 'chai'

jest.setTimeout(30000)

const UTXO = '34f0b50d64fe50998bc1dd5749a82229584fd6429c225bb1aeb8f5a24936edea'
const DOGE_TESTING_ADDRESS = 'DKs2WBbiaAEe9RGzQTmtJj1o9bqsKTUTtC'

test('Should be a VALID DOGE mainnet address', () => {
  const result = utils.doge.isValidAddress(DOGE_TESTING_ADDRESS)
  expect(result).to.be.equal(true)
})

test('Should be an INVALID DOGE address', () => {
  const result = utils.doge.isValidAddress('invalid')
  expect(result).to.be.equal(false)
})

test('Should monitor a DOGE utxo given an address', async () => {
  const eventEmitter = new EventEmitter()
  let isDogeTxBroadcasted = false
  let isDogeTxConfirmed = false
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('nativeBroadcast', () => {
        isDogeTxBroadcasted = true
      })
      eventEmitter.once('nativeConfirmed', () => {
        isDogeTxConfirmed = true
      })

      utils.doge
        .monitorUtxoByAddress('mainnet', DOGE_TESTING_ADDRESS, eventEmitter, 500, 'nativeBroadcast', 'nativeConfirmed')
        .then(() => resolve())
    })

  await start()
  expect(isDogeTxBroadcasted).to.be.equal(true)
  expect(isDogeTxConfirmed).to.be.equal(true)
})

test('Should monitor a DOGE transaction confirmation', async () => {
  const receipt = await utils.doge.waitForTransactionConfirmation('mainnet', UTXO, 500)
  expect(receipt).to.be.an('object')
})

test('Should get all DOGE utxo given an address', async () => {
  const utxos = await utils.doge.getUtxoByAddress('mainnet', DOGE_TESTING_ADDRESS)
  expect(utxos).to.be.an('Array')
})
