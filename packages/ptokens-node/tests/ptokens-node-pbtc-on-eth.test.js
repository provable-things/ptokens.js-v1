import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { constants } from 'ptokens-utils'

const { blockchains, pTokens } = constants

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pong'
const HASH_INCOMING_TX =
  'e761f59d6b43eb37463538be7587000e9d3617ba090c17ff2bf7718354d43053'
const HASH_BROADCASTED_TX =
  '28c9945d1f1277c781bbeffa9b379b4336b10368f441c2d0334a6a9d6b8cea6e'

const BTC_TESTING_ADDRESS = '2N4g72pPnrBxTriwrmkKR8yzxyehMscLMnh'
const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

const ENDPOINT = 'http://5a501f7a.ngrok.io/'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the node info', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const info = await node.getInfo()
  expect(info).to.have.property('public_key')
  expect(info).to.have.property('smart_contract_address')
  expect(info).to.have.property('last_processed_native_block')
  expect(info).to.have.property('last_processed_host_block')
  expect(info).to.have.property('native_network')
  expect(info).to.have.property('host_network')
})

test('Should get all peers', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const info = await node.peers()
  expect(info).to.be.instanceof(Array)
})

test('Should get all pbtc-on-eth reports given a sender address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportsBySenderAddress(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get all pbtc-on-eth reports given a recipient address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportsByRecipientAddress(
    BTC_TESTING_ADDRESS,
    limit
  )
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get pbtc-on-eth reports given a native address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportsByNativeAddress(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get pbtc-on-eth reports given an host address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportsByHostAddress(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get all pbtc-on-eth native reports', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getNativeReports(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get all pbtc-on-eth host reports', async () => {
  const expectedResultLength = 1
  const limit = 1
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getHostReports(BTC_TESTING_ADDRESS, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get a pbtc-on-eth report given an incoming tx hash', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportByIncomingTxHash(HASH_INCOMING_TX)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get a pbtc-on-eth report given a broadcasted tx hash', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getReportByIncomingTxHash(HASH_BROADCASTED_TX)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get a pbtc-on-eth native deposit address', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getNativeDepositAddress(ETH_TESTING_ADDRESS)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get all pbtc-on-eth deposit addresses', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getDepositAddresses(BTC_TESTING_ADDRESS)
  expect(res).to.be.an.instanceof(Array)
})

test('Should get last pbtc-on-eth processed native block', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getLastProcessedNativeBlock()
  expect(res).to.be.a('number')
})

test('Should get last pbtc-on-eth processed host block', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
  })

  const res = await node.getLastProcessedHostBlock()
  expect(res).to.be.a('number')
})

test('Should monitor an incoming pbtc-on-eth transaction', async () => {
  const node = new Node({
    pToken: pTokens.pBTC,
    blockchain: blockchains.Ethereum,
    endpoint: ENDPOINT
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
