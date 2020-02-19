import { Node } from '../src/index'
import { ETH_PEOS_BLOCK, EOS_PEOS_BLOCK } from './utils'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'Provable pong!'
const HASH_INCOMING_TX =
  'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3'
const HASH_BROADCASTED_TX =
  '3aa61c0188e065a7a90234dc3d544e8791f76423b5eb34d63201531c61f24066'
const ETH_BLOCK_SUBMITTED_RETURN_VALUE = 'Eth block submitted to the enclave!'
const EOS_BLOCK_SUBMITTED_RETURN_VALUE = 'Eos block submitted to the enclave!'

test('Should ping a node with one as default', async () => {
  const expectedResult = PING_RETURN_VALUE
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should generate an error because of invalid pToken name', () => {
  const invalidpTokenName = 'invalid'
  const expectedErrorMessage = 'Invalid pToken'

  try {
    new Node({
      pToken: {
        name: invalidpTokenName,
        redeemFrom: 'ETH'
      },
      endpoint: 'https://nuc-bridge-1.ngrok.io'
    })
  } catch (err) {
    expect(err.message).to.be.equal(expectedErrorMessage)
  }
})

test('Should get ten ETH report', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eth'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ten EOS report', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eos'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ten ETH reports by address', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eth'
  const ethAddress = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, ethAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ten EOS reports by address', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eos'
  const eosAccount = 'all3manfr3di'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportsByAddress(type, eosAccount, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ETH reports by nonce', async () => {
  const nonce = 750
  const type = 'eth'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`ETH ${nonce}`)
})

test('Should get EOS reports by nonce', async () => {
  const nonce = 750
  const type = 'eos'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`EOS ${nonce}`)
})

test('Should get last ETH processed block', async () => {
  const type = 'eth'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last EOS processed block', async () => {
  const type = 'eos'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
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
      name: 'pEOS',
      redeemFrom: 'ETH'
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
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should submit an ETH block', async () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eth'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.submitBlock(type, ETH_PEOS_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should submit an EOS block', async () => {
  const expectedResult = EOS_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eos'
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    },
    endpoint: 'https://nuc-bridge-1.ngrok.io'
  })

  const res = await node.submitBlock(type, EOS_PEOS_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should monitor an incoming transaction', async () => {
  const node = new Node({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
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
        .monitorIncomingTransaction(HASH_INCOMING_TX, 'issue', eventEmitter)
        .then(tx => {
          expect(tx).to.be.a('string')
          resolve()
        })
    })
  await start()
  expect(nodeHasReceivedTx).to.be.equal(true)
  expect(nodeHasBroadcastedTx).to.be.equal(true)
})
