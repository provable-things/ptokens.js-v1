import { Node } from '../src/index'
import { expect } from 'chai'
import { ETH_PBTC_BLOCK, BTC_PBTC_BLOCK } from './utils'
import EventEmitter from 'eventemitter3'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pBTC pong!'
const HASH_INCOMING_TX =
  '0xe3a303ac74f96450648d9e33f6d7f63f7891ea02dffe1b448df296987ccefaa3'
const HASH_BROADCASTED_TX =
  '0x39e09502da6eab6e518bc35755261f094fcf2afc3ed46aeff45218a52e0214fa'

const BTC_TESTING_ADDRESS = '2N91WkHJxTwM43d7eeA1ArjutoBvKk3iiE5'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the node info', async () => {
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const info = await node.getInfo()
  expect(info).to.have.property('public_key')
  expect(info).to.have.property('smart_contract_address')
  expect(info).to.have.property('last_processed_native_block')
  expect(info).to.have.property('last_processed_host_block')
  expect(info).to.have.property('native_network')
  expect(info).to.have.property('host_network')
})

test('Should get one ETH report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one BTC report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'native'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one ETH reports by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const ethAddress = BTC_TESTING_ADDRESS
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, ethAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one BTC report by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'native'
  const btcAddress = BTC_TESTING_ADDRESS
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, btcAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ETH report by nonce', async () => {
  const nonce = 1
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_ETH ${nonce}`)
})

test('Should get BTC report by nonce', async () => {
  const nonce = 1
  const type = 'native'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_BTC ${nonce}`)
})

test('Should get last ETH processed block', async () => {
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last BTC processed block', async () => {
  const type = 'native'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  const res = await node.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should submit an ETH block', async () => {
  const expectedResult = 'Request failed with status code 501' // provisional
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  try {
    await node.submitBlock(type, ETH_PBTC_BLOCK)
  } catch (err) {
    expect(err.message).to.be.equal(expectedResult)
  }
})

test('Should submit a BTC block', async () => {
  const expectedResult = 'Request failed with status code 501' // provisional
  const type = 'native'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
  })

  try {
    await node.submitBlock(type, BTC_PBTC_BLOCK)
  } catch (err) {
    expect(err.message).to.be.equal(expectedResult)
  }
})

test('Should monitor an incoming transaction', async () => {
  const node = new Node({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-2.ngrok.io'
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
