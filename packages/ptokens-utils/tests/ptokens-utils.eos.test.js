import utils from '../src'
import { expect } from 'chai'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const eosPrivateKey = '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv'
const eosProvider = 'https://ptoken-eos.provable.xyz:443'

jest.setTimeout(30000)

test('Should get the correct EOS account name', async () => {
  const signatureProvider = new JsSignatureProvider([eosPrivateKey])
  const rpc = new JsonRpc(eosProvider, { fetch })
  const expectedAccountName = 'all3manfr4di'
  const publicKeys = await signatureProvider.getAvailableKeys()
  const accountName = await utils.eos.getAccountName(rpc, publicKeys)
  expect(accountName).to.be.equal(expectedAccountName)
})

test('Should be a valid EOS account name', () => {
  const validEosAccountName = 'all3manfr3di'
  const isValid = utils.eos.isValidAccountName(validEosAccountName)
  expect(isValid).to.be.equal(true)
})

test('Should not be a valid EOS account name', () => {
  const notValidEosAccountName = 'not valid eos account'
  const isValid = utils.eos.isValidAccountName(notValidEosAccountName)
  expect(isValid).to.be.equal(false)
})
