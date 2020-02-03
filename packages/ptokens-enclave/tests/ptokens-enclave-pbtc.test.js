import Enclave from '../src/index'
import { expect } from 'chai'
import { ETH_PBTC_BLOCK, BTC_PBTC_BLOCK } from './utils'
import EventEmitter from 'eventemitter3'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pBTC pong!'
const ETH_BLOCK_SUBMITTED_RETURN_VALUE = 'Eth block submitted to the enclave!'
const BTC_BLOCK_SUBMITTED_RETURN_VALUE = 'Btc block submitted to the enclave!'
const HASH_INCOMING_TX =
  'a177f86e24eb3ffc0a272f7f0bd6cb8fb6acb97a67ac211a7863b12dfcec1a29'
const HASH_BROADCASTED_TX =
  '0xac53ba6214ad2b0513fd6d69ab2c39a6649fc83a61048eb5d4aebad80f0cbe30'

const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'
const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

test('Should ping the enclave', async () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the Enclave Info', async () => {
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const info = await enclave.getInfo('testnet', 'ropsten')
  expect(info).to.have.property('pbtc-public-key')
  expect(info).to.have.property('pbtc-smart-contract-address')
})

test('Should get one ETH report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'eth'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one BTC report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'btc'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get four ETH reports by address', async () => {
  const expectedResultLength = 4
  const limit = 4
  const type = 'eth'
  const ethAddress = ETH_TESTING_ADDRESS
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReportsByAddress(type, ethAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get five BTC reports by address', async () => {
  const expectedResultLength = 5
  const limit = 5
  const type = 'btc'
  const btcAddress = BTC_TESTING_ADDRESS
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReportsByAddress(type, btcAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ETH reports by nonce', async () => {
  const nonce = 1
  const type = 'eth'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_ETH ${nonce}`)
})

test('Should get BTC reports by nonce', async () => {
  const nonce = 1
  const type = 'btc'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_BTC ${nonce}`)
})

test('Should get last ETH processed block', async () => {
  const type = 'eth'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last BTC processed block', async () => {
  const type = 'btc'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should submit an ETH block', async () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eth'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.submitBlock(type, ETH_PBTC_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should submit a BTC block', async () => {
  const expectedResult = BTC_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'btc'
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  const res = await enclave.submitBlock(type, BTC_PBTC_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should monitor an incoming transaction', async () => {
  const enclave = new Enclave({
    pToken: 'pbtc'
  })

  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false

  const eventEmitter = new EventEmitter()

  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onEnclaveReceivedTx', () => {
        enclaveHasReceivedTx = true
      })
      eventEmitter.once('onEnclaveBroadcastedTx', () => {
        enclaveHasBroadcastedTx = true
      })
      enclave
        .monitorIncomingTransaction(HASH_INCOMING_TX, 'issue', eventEmitter)
        .then(tx => {
          expect(tx).to.be.a('string')
          resolve()
        })
    })
  await start()
  expect(enclaveHasReceivedTx).to.be.equal(true)
  expect(enclaveHasBroadcastedTx).to.be.equal(true)
})
