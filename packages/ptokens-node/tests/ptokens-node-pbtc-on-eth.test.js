import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { constants } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

const { blockchains, pTokens } = constants

jest.setTimeout(300000)

// prettier-ignore
const HASH_INCOMING_TX = '2099603a0ee85fce936430828af84fac3efa4fa9d34289f702c31c3de160a7ef'
// prettier-ignore
const HASH_BROADCASTED_TX = '0x4337e0ab72fe3a2329c8cb6fe666a2d11a9d8b4e4e47a293029cbf7487419165'
// deposit address
const BTC_TESTING_ADDRESS = '3PLpcC8C9xWYuvdhnmLA2dp2qm7KvjGgi7'
const ETH_TESTING_ADDRESS = '0x468727d0770a301d2721968765ac0b003ce332c5'
const ENDPOINT = 'https://pbtc-node-1a.ngrok.io'

let node
beforeEach(() => {
  node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })
})

test('Should ping a node with one as default', async () => {
  const res = await node.ping()
  expect(res).to.be.equal('pong')
})

test('Should ping a node after having set the headers', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
      'Content-Type': 'application/json',
      'User-Agent': 'ptokens tests'
    })
  })

  const res = await node.ping()
  expect(res).to.be.equal('pong')
})

test('Should get the node info', async () => {
  const info = await node.getInfo()
  expect(info).to.have.property('public_key')
  expect(info).to.have.property('smart_contract_address')
  expect(info).to.have.property('last_processed_native_block')
  expect(info).to.have.property('last_processed_host_block')
  expect(info).to.have.property('native_network')
  expect(info).to.have.property('host_network')
  expect(info).to.have.property('native_blockchain')
  expect(info).to.have.property('host_blockchain')
  expect(info).to.have.property('host_symbol')
})

test('Should get one host report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getHostReports(limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getNativeReports(limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one host reports by sender address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsBySenderAddress(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by recipient address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByRecipientAddress(
    ETH_TESTING_ADDRESS,
    limit
  )
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one host reports by native address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByNativeAddress(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by host address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByHostAddress(ETH_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get a host reports by incoming tx hash', async () => {
  const limit = 1
  const res = await node.getReportByIncomingTxHash(HASH_INCOMING_TX, limit)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get a native report by broadcast tx hash', async () => {
  const limit = 1
  const res = await node.getReportByBroadcastTxHash(HASH_BROADCASTED_TX, limit)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last BTC processed block', async () => {
  const res = await node.getLastProcessedNativeBlock()
  expect(res).to.be.a('number')
})

test('Should monitor an incoming transaction', async () => {
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  const eventEmitter = new EventEmitter()
  const start = () =>
    new Promise(resolve => {
      eventEmitter.once('onNodeReceivedTx', () => {
        nodeHasReceivedTx += 1
      })
      eventEmitter.once('nodeReceivedTx', () => {
        nodeHasReceivedTx += 1
      })
      eventEmitter.once('onNodeBroadcastedTx', () => {
        nodeHasBroadcastedTx += 1
      })
      eventEmitter.once('nodeBroadcastedTx', () => {
        nodeHasBroadcastedTx += 1
      })
      node
        .monitorIncomingTransaction(HASH_INCOMING_TX, eventEmitter)
        .then(() => {
          resolve()
        })
    })
  await start()
  expect(nodeHasReceivedTx).to.be.equal(2)
  expect(nodeHasBroadcastedTx).to.be.equal(2)
})
