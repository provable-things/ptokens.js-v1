import utils from '../src'
import { expect } from 'chai'

test('Should return true because of valid pToken', () => {
  const pToken = {
    name: 'pBTC',
    redeemFrom: 'ETH'
  }
  const exptectedResult = true
  const result = utils.helpers.pTokenIsValid(pToken)
  expect(result).to.be.equal(exptectedResult)
})

test('Should return false because of invalid pTokenName', () => {
  const pToken = {
    name: 'pBTCccc',
    redeemFrom: 'eth'
  }
  const exptectedResult = false
  const result = utils.helpers.pTokenIsValid(pToken)
  expect(result).to.be.equal(exptectedResult)
})
