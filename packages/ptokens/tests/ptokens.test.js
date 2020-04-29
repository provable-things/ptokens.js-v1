import pTokens from '../src/index'
import { pBTC } from 'ptokens-pbtc'
import { constants } from 'ptokens-utils'
import { expect } from 'chai'

test('Should init pTokens correctly with 1 instance of pBTC', () => {
  const ptokens = new pTokens({
    pbtc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    }
  })
  expect(ptokens.pbtc).to.be.an.instanceof(pBTC)
})

test('Should init pTokens correctly with 2 instance of pBTC', () => {
  const ptokens = new pTokens({
    pbtc: [
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet
      },
      {
        blockchain: constants.blockchains.Eosio,
        network: constants.networks.Testnet
      }
    ]
  })
  expect(ptokens.pbtc).to.be.an.instanceof(Array)
})
