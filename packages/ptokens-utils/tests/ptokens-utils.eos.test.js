import utils from '../src'
import { expect } from 'chai'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const eosPrivateKey = '5JFPd8Kvhf7zSrxKCrMvhK22WKbh1jFw5TLeLjyPpp2yh4SvReS'
const eosProvider = 'http://23.97.190.44:8888'

jest.setTimeout(30000)

test('Should get the correct EOS account name', async () => {
  const signatureProvider = new JsSignatureProvider([eosPrivateKey])
  const rpc = new JsonRpc(eosProvider, { fetch })
  const expectedAccountName = 'all3manfr4di'
  const publicKeys = await signatureProvider.getAvailableKeys()
  const accountName = await utils.eos.getAccountName(rpc, publicKeys)
  expect(accountName).to.be.equal(expectedAccountName)
})

test('all3manfr3di should be a valid EOS account name', () => {
  const validEosAccountName = 'all3manfr3di'
  const isValid = utils.eos.isValidAccountName(validEosAccountName)
  expect(isValid).to.be.equal(true)
})

test('all3manfr.di should be a valid EOS account name', () => {
  const validEosAccountName = 'all3manfr.di'
  const isValid = utils.eos.isValidAccountName(validEosAccountName)
  expect(isValid).to.be.equal(true)
})

test('btc.ptokens should be a valid EOS account name', () => {
  const validEosAccountName = 'btc.ptokens'
  const isValid = utils.eos.isValidAccountName(validEosAccountName)
  expect(isValid).to.be.equal(true)
})

test('Should not be a valid EOS account name', () => {
  const notValidEosAccountName = 'not valid eos account'
  const isValid = utils.eos.isValidAccountName(notValidEosAccountName)
  expect(isValid).to.be.equal(false)
})
