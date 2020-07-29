import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { constants } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

const { blockchains, pTokens } = constants

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pBTC pong!'
const HASH_INCOMING_TX =
  '2099603a0ee85fce936430828af84fac3efa4fa9d34289f702c31c3de160a7ef'
const HASH_BROADCASTED_TX =
  '0x4337e0ab72fe3a2329c8cb6fe666a2d11a9d8b4e4e47a293029cbf7487419165'

const BTC_TESTING_ADDRESS = '31wgV6Ld9Bd88KCd3V9ngkX9L22DZmrwfL'

const ENDPOINT = 'https://pbtc-node-1a.ngrok.io'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should ping a node after having set the headers', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  node.provider.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
    'Content-Type': 'application/json',
    'User-Agent': 'ptokens tests'
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the node info', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
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
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
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
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
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
  const ethAddress = BTC_TESTING_ADDRESS
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getReportsByAddress(type, ethAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one native report by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'native'
  const btcAddress = BTC_TESTING_ADDRESS
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getReportsByAddress(type, btcAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get host report by nonce', async () => {
  const nonce = 1
  const type = 'host'
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get native report by nonce', async () => {
  const nonce = 1
  const type = 'native'
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last ETH processed block', async () => {
  const type = 'host'
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last BTC processed block', async () => {
  const type = 'native'
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

  const res = await node.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should monitor an incoming transaction', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    provider: new HttpProvider(ENDPOINT)
  })

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
