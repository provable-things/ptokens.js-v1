import { Enclave } from '../src/index'
import { ethBlock, eosBlock } from './utils'
import { expect } from 'chai'

test('Should ping the enclave with callback', () => {
  const expectedResult = 'Provable pong!'
  const enclave = new Enclave()
  enclave.ping((r, e) => {
    expect(r.data)
      .to.be.equal(expectedResult)
  })
})

test('Should ping the enclave with promise', async () => {
  const expectedResult = 'Provable pong!'
  const enclave = new Enclave()
  const result = await enclave.ping()
  expect(result.data)
    .to.be.equal(expectedResult)
})

test('Should get ETH report with callback', () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  enclave.getEthReport(limit, (r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Array)
      .to.have.lengthOf(expectedResultLength)
  })
})

test('Should get ETH report with promise', async () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  const r = await enclave.getEthReport(limit)
  expect(r.data)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get EOS report with callback', () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  enclave.getEosReport(limit, (r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Array)
      .to.have.lengthOf(expectedResultLength)
  })
})

test('Should get EOS report with promise', async () => {
  const expectedResultLength = 10
  const limit = 10
  const enclave = new Enclave()
  const r = await enclave.getEosReport(limit)
  expect(r.data)
    .to.be.an.instanceof(Array)
    .to.have.lengthOf(expectedResultLength)
})

test('Should get last ETH processed block with callback', () => {
  const enclave = new Enclave()
  enclave.getLastProcessedEthBlock((r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Object)
  })
})

test('Should get last ETH processed block with promise', async () => {
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedEthBlock()
  expect(r.data)
    .to.be.an.instanceof(Object)
})

test('Should get last EOS processed block with callback', () => {
  const enclave = new Enclave()
  enclave.getLastProcessedEosBlock((r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Object)
  })
})

test('Should get last EOS processed block with promise', async () => {
  const enclave = new Enclave()
  const r = await enclave.getLastProcessedEosBlock()
  expect(r.data)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an incoming tx with callback', () => {
  const hash = 'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3'
  const enclave = new Enclave()
  enclave.getIncomingTransactionStatus(hash, (r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Object)
  })
})

test('Should get the status of an incoming tx with promise', async () => {
  const hash = 'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3'
  const enclave = new Enclave()
  const r = await enclave.getIncomingTransactionStatus(hash)
  expect(r.data)
    .to.be.an.instanceof(Object)
})

test('Should get the status of an brodcasted tx with callback', () => {
  const hash = '3aa61c0188e065a7a90234dc3d544e8791f76423b5eb34d63201531c61f24066'
  const enclave = new Enclave()
  enclave.getBroadcastTransactionStatus(hash, (r, e) => {
    expect(r.data)
      .to.be.an.instanceof(Object)
  })
})

test('Should get the status of an brodcasted tx with promise', async () => {
  const hash = '3aa61c0188e065a7a90234dc3d544e8791f76423b5eb34d63201531c61f24066'
  const enclave = new Enclave()
  const r = await enclave.getBroadcastTransactionStatus(hash)
  expect(r.data)
    .to.be.an.instanceof(Object)
})

test('Should submit an ETH block with callback', () => {
  const expectedResult = 'Eth block submitted to the enclave!'
  const enclave = new Enclave()
  enclave.submitEthBlock(ethBlock, (r, e) => {
    expect(r.data)
      .to.be.equal(expectedResult)
  })
})

test('Should submit an ETH block with promise', async () => {
  const expectedResult = 'Eth block submitted to the enclave!'
  const enclave = new Enclave()
  const r = await enclave.submitEthBlock(ethBlock)
  expect(r.data)
    .to.be.equal(expectedResult)
})

test('Should submit an EOS block with callback', () => {
  const expectedResult = 'Eos block submitted to the enclave!'
  const enclave = new Enclave()
  enclave.submitEosBlock(eosBlock, (r, e) => {
    expect(r.data)
      .to.be.equal(expectedResult)
  })
})

test('Should submit an EOS block with promise', async () => {
  const expectedResult = 'Eos block submitted to the enclave!'
  const enclave = new Enclave()
  const r = await enclave.submitEosBlock(eosBlock)
  expect(r.data)
    .to.be.equal(expectedResult)
})