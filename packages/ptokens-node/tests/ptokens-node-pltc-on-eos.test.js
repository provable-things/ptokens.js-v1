import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { constants } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

const { blockchains, pTokens } = constants

jest.setTimeout(300000)

const HASH_INCOMING_TX = '4fc92193c675cb9c788b177f0217f7a11a19672f0cb194d0ab82665c1aeb8fd4'
const HASH_BROADCASTED_TX = '4aa602dc1b79a70630f5b7e31dd2a0f1cacfb2ba5498db85add67d5a10ddf52e'
// deposit address
const LTC_TESTING_ADDRESS = 'MFQ4CxrNdasetHZar5Yi92brg6ySWiA1Lx'
const EOS_TESTING_ADDRESS = 't11ptokens11'
const ENDPOINT = 'https://pltconeos-node-1a.ngrok.io'

let node
beforeEach(() => {
  node = new Node({
    pToken: pTokens.pLTC,
    blockchain: blockchains.Eosio,
    provider: new HttpProvider(ENDPOINT)
  })
})

test('Should ping a node with one as default', async () => {
  const res = await node.ping()
  expect(res).to.be.equal('pong')
})

test('Should ping a node after having set the headers', async () => {
  const node = new Node({
    pToken: pTokens.pLTC,
    blockchain: blockchains.Eosio,
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
  const res = await node.getReportsBySenderAddress(LTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by recipient address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByRecipientAddress(EOS_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one host reports by native address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByNativeAddress(LTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by host address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByHostAddress(EOS_TESTING_ADDRESS, limit)
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

test('Should get last LTC processed block', async () => {
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
      node.monitorIncomingTransaction(HASH_INCOMING_TX, eventEmitter).then(() => {
        resolve()
      })
    })
  await start()
  expect(nodeHasReceivedTx).to.be.equal(2)
  expect(nodeHasBroadcastedTx).to.be.equal(2)
})
