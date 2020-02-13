import Enclave from '../src/index'
import { expect } from 'chai'
import EventEmitter from 'eventemitter3'
import { ETH_PLTC_BLOCK, LTC_PLTC_BLOCK } from './utils'
jest.setTimeout(300000)

const PING_RETURN_VALUE = 'pLTC pong!'
const ETH_BLOCK_SUBMITTED_RETURN_VALUE = 'Eth block submitted to the enclave!'
const LTC_BLOCK_SUBMITTED_RETURN_VALUE = 'Btc block submitted to the enclave!'
const HASH_INCOMING_TX =
  '0x8fe8835f04ef50fb6eecbe0fbaaf744ee1c4b218e253f5d5408f55d50f1053b8'
const HASH_BROADCASTED_TX =
  '20ea966f38240ac2b2f781b049683d3603680ee6c4be8a78d498bc2b92513c55'

const LTC_TESTING_ADDRESS = 'QQPAnYG1muVgNvq7d7sKAgAvvTgydJ24oi'

test('Should ping the enclave without a selected node', async () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should ping the enclave with a selected node', async () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    },
    defaultNode: 'https://nuc-bridge-3.ngrok.io'
  })

  const res = await enclave.ping()
  expect(res).to.be.equal(expectedResult)
})

test('Should ping the enclave with a node different of default because it is invalid', async () => {
  const uncreachableNode = 'https://uncreachable-node.io'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    },
    defaultNode: uncreachableNode
  })

  await enclave.ping()
  expect(enclave.selectedNode.endpoint).to.be.not.equal(uncreachableNode)
})

test('Should get the Enclave Info', async () => {
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
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
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one LTC report', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'ltc'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReports(type, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one ETH report by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'eth'
  const ethAddress = LTC_TESTING_ADDRESS
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReportsByAddress(type, ethAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get one LTC reports by address', async () => {
  const expectedResultLength = 1
  const limit = 1
  const type = 'ltc'
  const ltcAddress = LTC_TESTING_ADDRESS
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReportsByAddress(type, ltcAddress, limit)
  expect(res)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get ETH reports by nonce', async () => {
  const nonce = 1
  const type = 'eth'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_ETH ${nonce}`)
})

test('Should get LTC reports by nonce', async () => {
  const nonce = 1
  const type = 'ltc'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getReportByNonce(type, nonce)
  expect(res).to.be.an.instanceof(Object)
  expect(res._id).to.be.equal(`pBTC_BTC ${nonce}`)
})

test('Should get last ETH processed block', async () => {
  const type = 'eth'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get last LTC processed block', async () => {
  const type = 'ltc'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getLastProcessedBlock(type)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getIncomingTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.getBroadcastTransactionStatus(hash)
  expect(res).to.be.an.instanceof(Object)
})

test('Should submit an ETH block', async () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eth'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.submitBlock(type, ETH_PLTC_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should submit a LTC block', async () => {
  const expectedResult = LTC_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'ltc'
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const res = await enclave.submitBlock(type, LTC_PLTC_BLOCK)
  expect(res).to.be.equal(expectedResult)
})

test('Should monitor an incoming pLTC transaction', async () => {
  const enclave = new Enclave({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
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
        .then(() => {
          resolve()
        })
    })
  await start()
  expect(enclaveHasReceivedTx).to.be.equal(true)
  expect(enclaveHasBroadcastedTx).to.be.equal(true)
})
