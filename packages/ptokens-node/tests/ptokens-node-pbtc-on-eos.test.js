import { Node } from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pToken pong!'
const HASH_INCOMING_TX =
  'a7f13767d53a7c62c1531680ef8e20528be879167547cd2c3013bf342563d938'
const HASH_BROADCASTED_TX =
  '35e5c5925396dffc578e8bb4dc3b9f708a730e932aca2f696e70ee4a82df3ccf'

const BTC_TESTING_ADDRESS = '2NBhZuu8t2cb2K7VivUyXXLGfS5uQzrW1Bx'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should get the node info', async () => {
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
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

test('Should get one EOS report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
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
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one EOS reports by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'host'
  const ethAddress = BTC_TESTING_ADDRESS
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
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
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, btcAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get EOS report by nonce', async () => {
  const nonce = 1
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
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
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_BTC ${nonce}`)
})

test('Should get last EOS processed block', async () => {
  const type = 'host'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last BTC processed block', async () => {
  const type = 'native'
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should monitor an incoming transaction', async () => {
  const node = new Node({
    pToken: {
      name: 'pBTC',
      hostBlockchain: 'EOS'
    },
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
