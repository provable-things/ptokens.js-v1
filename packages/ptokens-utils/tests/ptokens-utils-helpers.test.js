import utils from '../src'
import { expect } from 'chai'

test('Should return pTokenName normalized', () => {
  const pTokenName = 'pEOS'
  const exptectedpTokenName = 'peos'
  const result = utils.helpers.pTokenNameNormalized(pTokenName)
  expect(result)
    .to.be.equal(exptectedpTokenName)
})

test('Should return true because of valid pTokenName', () => {
  const pTokenName = 'pEOS'
  const exptectedpTokenName = true
  const result = utils.helpers.pTokenNameIsValid(pTokenName)
  expect(result)
    .to.be.equal(exptectedpTokenName)
})

test('Should return false because of invalid pTokenName', () => {
  const pTokenName = 'pEOSss'
  const exptectedpTokenName = false
  const result = utils.helpers.pTokenNameIsValid(pTokenName)
  expect(result)
    .to.be.equal(exptectedpTokenName)
})
