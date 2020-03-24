import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pToken pong!'
const HASH_INCOMING_TX =
  '6e0dd8bcc729817462d28b650911059a380d4423f6549d4441c8c45666d3f083'
const HASH_BROADCASTED_TX =
  'a6ee83f6e92f5fa5717a1c13f7ad0ef40d1a6cd394c02ad196ee2c0b05ebe2c9'

// deposit address
const BTC_TESTING_ADDRESS = '2N2uQzRAsfouFc86d3xRrsVPcSuZuXdLLs4'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the node info', async () => {
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const info = await node.getInfo()
  expect(info).to.have.property('public_key')
  expect(info).to.have.property('smart_contract_address')
  expect(info).to.have.property('last_processed_native_block')
  expect(info).to.have.property('last_processed_host_block')
  expect(info).to.have.property('native_network')
  expect(info).to.have.property('host_network')
})

test('Should get one host report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'native'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one host reports by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'native'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get host report by nonce', async () => {
  const nonce = 1
  const type = 'host'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_EOS ${nonce}`)
})

test('Should get native report by nonce', async () => {
  const nonce = 1
  const type = 'native'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_BTC ${nonce}`)
})

/* test('Should get last EOS processed block', async () => {
  const type = 'host'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
}) */

test('Should get last BTC processed block', async () => {
  const type = 'native'
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should monitor an incoming transaction', async () => {
  const node = new Node({
    pToken: 'pBTC',
    blockchain: 'EOS',
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false

  const eventEmitter = new EventEmitter()

  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onNodeReceivedTx', () => {
        nodeHasReceivedTx = true
      })
      eventEmitter.once('onNodeBroadcastedTx', () => {
        nodeHasBroadcastedTx = true
      })
      node
        .monitorIncomingTransaction(HASH_INCOMING_TX, eventEmitter)
        .then(() => {
          resolve()
        })
    })
  await start()
  expect(nodeHasReceivedTx).to.be.equal(true)
  expect(nodeHasBroadcastedTx).to.be.equal(true)
})
