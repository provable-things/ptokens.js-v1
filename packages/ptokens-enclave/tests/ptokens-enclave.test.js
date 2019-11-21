import Enclave from '../src/index'
import { ETH_BLOCK, EOS_BLOCK } from './utils'
import { expect } from 'chai'

jest.setTimeout(300000)

const PING_RETURN_VALUE = 'Provable pong!'
const HASH_INCOMING_TX = 'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3'
const HASH_BROADCASTED_TX = '3aa61c0188e065a7a90234dc3d544e8791f76423b5eb34d63201531c61f24066'
const ETH_BLOCK_SUBMITTED_RETURN_VALUE = 'Eth block submitted to the enclave!'
const EOS_BLOCK_SUBMITTED_RETURN_VALUE = 'Eos block submitted to the enclave!'

test('Should ping the enclave', async () => {
  const expectedResult = PING_RETURN_VALUE
  const enclave = new Enclave()
  const result = await enclave.ping()
  expect(result)
    .to.be.equal(expectedResult)
})

test('Should get ETH report', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eth'
  const enclave = new Enclave()
  const r = await enclave.getReport(limit, type)
  expect(r)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get EOS report', async () => {
  const expectedResultLength = 10
  const limit = 10
  const type = 'eos'
  const enclave = new Enclave()
  const r = await enclave.getReport(limit, type)
  expect(r)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get last ETH processed block', async () => {
  const type = 'eth'
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedBlock(type)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get last EOS processed block', async () => {
  const type = 'eos'
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedBlock(type)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx', async () => {
  const hash = HASH_INCOMING_TX
  const enclave = new Enclave()
  const r = await enclave.getIncomingTransactionStatus(hash)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx', async () => {
  const hash = HASH_BROADCASTED_TX
  const enclave = new Enclave()
  const r = await enclave.getBroadcastTransactionStatus(hash)
  expect(r)
    .to.be.an.instanceof(Object)
})

test('Should submit an ETH block', async () => {
  const expectedResult = ETH_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eth'
  const enclave = new Enclave()
  const r = await enclave.submitBlock(ETH_BLOCK, type)
  expect(r)
    .to.be.equal(expectedResult)
})

test('Should submit an EOS block', async () => {
  const expectedResult = EOS_BLOCK_SUBMITTED_RETURN_VALUE
  const type = 'eos'
  const enclave = new Enclave()
  const r = await enclave.submitBlock(EOS_BLOCK, type)
  expect(r)
    .to.be.equal(expectedResult)
})