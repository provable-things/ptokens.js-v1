import Enclave from '../src/index'
import { ETH_BLOCK, EOS_BLOCK } from './utils'
import { expect } from 'chai'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'Provable pong!'
const HASH_INCOMING_TX = 'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3'
const HASH_BROADCASTED_TX = '3aa61c0188e065a7a90234dc3d544e8791f76423b5eb34d63201531c61f24066'
const ETH_BLOCK_SUBMITTED_RETURN_VALUE = 'Eth block submitted to the enclave!'
const EOS_BLOCK_SUBMITTED_RETURN_VALUE = 'Eos block submitted to the enclave!'

test('Should ping the enclave with callback', () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave()
  enclave.ping((r, e) => {
    expect(r)
      .to.be.equal(expectedResult)
  })
})

test('Should ping the enclave with promise', async () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave()
  const result = await enclave.ping()
  expect(result)
    .to.be.equal(expectedResult)
})

test('Should get ETH report with callback', () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  enclave.getEthReport(limit, (r, e) => {
    expect(r)
      .to.be.an.instanceof(Array)
      .to.have.lengthOf(expectedResultLength)
  })
})

test('Should get ETH report with promise', async () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  const r = await enclave.getEthReport(limit)
  expect(r)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get EOS report with callback', () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  enclave.getEosReport(limit, (r, e) => {
    expect(r)
      .to.be.an.instanceof(Array)
      .to.have.lengthOf(expectedResultLength)
  })
})

test('Should get EOS report with promise', async () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  const r = await enclave.getEosReport(limit)
  expect(r)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get last ETH processed block with callback', () => {
  const enclave = new Enclave()
  enclave.getLastProcessedEthBlock((r, e) => {
    expect(r)
      .to.be.an.instanceof(Object)
  })
})

test('Should get last ETH processed block with promise', async () => {
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedEthBlock()
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get last EOS processed block with callback', () => {
  const enclave = new Enclave()
  enclave.getLastProcessedEosBlock((r, e) => {
    expect(r)
      .to.be.an.instanceof(Object)
  })
})

test('Should get last EOS processed block with promise', async () => {
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedEosBlock()
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx with callback', () => {
  const hash = HASH_INCOMING_TX
  const enclave = new Enclave()
  enclave.getIncomingTransactionStatus(hash, (r, e) => {
    expect(r)
      .to.be.an.instanceof(Object)
  })
})

test('Should get the status of an incoming tx with promise', async () => {
  const hash = HASH_INCOMING_TX
  const enclave = new Enclave()
  const r = await enclave.getIncomingTransactionStatus(hash)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx with callback', () => {
  const hash = HASH_BROADCASTED_TX
  const enclave = new Enclave()
  enclave.getBroadcastTransactionStatus(hash, (r, e) => {
    expect(r)
      .to.be.an.instanceof(Object)
  })
})

test('Should get the status of an brodcasted tx with promise', async () => {
  const hash = HASH_BROADCASTED_TX
  const enclave = new Enclave()
  const r = await enclave.getBroadcastTransactionStatus(hash)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should submit an ETH block with callback', () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const enclave = new Enclave()
  enclave.submitEthBlock(ETH_BLOCK, (r, e) => {
    expect(r)
      .to.be.equal(expectedResult)
  })
})

test('Should submit an ETH block with promise', async () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const enclave = new Enclave()
  const r = await enclave.submitEthBlock(ETH_BLOCK)
  expect(r)
    .to.be.equal(expectedResult)
})

test('Should submit an EOS block with callback', () => {
  const expectedResult = EOS_BLOCK_SUBMITTED_RETURN_VALUE
  const enclave = new Enclave()
  enclave.submitEosBlock(EOS_BLOCK, (r, e) => {
    expect(r)
      .to.be.equal(expectedResult)
  })
})

test('Should submit an EOS block with promise', async () => {
  const expectedResult = EOS_BLOCK_SUBMITTED_RETURN_VALUE
  const enclave = new Enclave()
  const r = await enclave.submitEosBlock(EOS_BLOCK)
  expect(r)
    .to.be.equal(expectedResult)
})
