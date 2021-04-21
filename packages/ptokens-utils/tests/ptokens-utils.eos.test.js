import utils from '../src'
import { expect } from 'chai'

jest.setTimeout(30000)

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
