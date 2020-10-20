import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { constants } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

const { blockchains, pTokens } = constants

jest.setTimeout(300000)

// prettier-ignore
const HASH_INCOMING_TX = '0x37917fed6b605ad21b23b4441eed52f4caa415fa091b431bd89fdf51ab63b076'
// prettier-ignore
const HASH_BROADCASTED_TX = '368c36c50a2756dc83172908bf5f4d3aa62884938ca1b0ebce2850a842cc3af9'
// deposit address
const ETH_TESTING_ADDRESS = '0x75ef320c9aec396ee1b061d21e14658709ed28d2'
const EOS_TESTING_ADDRESS = 't11ptokens11'
const ENDPOINT = 'https://pethoneos-node-1a.ngrok.io'

let node
beforeEach(() => {
  node = new Node({
    pToken: pTokens.pWETH,
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
    pToken: pTokens.pWETH,
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
  expect(info).to.have.property('host_smart_contract_address')
  expect(info).to.have.property('native_smart_contract_address')
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
  const res = await node.getReportsBySenderAddress(ETH_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by recipient address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByRecipientAddress(
    EOS_TESTING_ADDRESS,
    limit
  )
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one host reports by native address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const res = await node.getReportsByNativeAddress(ETH_TESTING_ADDRESS, limit)
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
