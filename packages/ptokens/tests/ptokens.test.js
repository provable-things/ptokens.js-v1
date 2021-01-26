import pTokens from '../src/index'
import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import { pERC20 } from 'ptokens-perc20'
import { constants } from 'ptokens-utils'
import { pEOSToken } from 'ptokens-peos-token'
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
  expect(ptokens.pbtc).to.have.lengthOf(2)
})

test('Should init pTokens correctly with 2 instance of pLTC', () => {
  const ptokens = new pTokens({
    pltc: [
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet
      },
      {
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Mainnet
      }
    ]
  })
  expect(ptokens.pltc).to.be.an.instanceof(Array)
  expect(ptokens.pltc).to.have.lengthOf(2)
})

test('Should init pTokens correctly with more ptokens instances', () => {
  const ptokens = new pTokens({
    pbtc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    },
    pltc: {
      blockchain: constants.blockchains.Ethereum,
      network: constants.networks.Testnet
    },
    perc20: [
      {
        pToken: constants.pTokens.pWETH,
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet,
        ethPrivateKey: 'e7c862ea586f7ca20d1d370b30211062fc49066a5b2aacf25a22620620b09200',
        ethProvider: 'https://provider.com',
        eosPrivateKey: 'private key',
        eosSignatureProvider: 'https://provider.com'
      },
      {
        pToken: constants.pTokens.pETH,
        blockchain: constants.blockchains.Ethereum,
        network: constants.networks.Testnet,
        ethPrivateKey: 'e7c862ea586f7ca20d1d370b30211062fc49066a5b2aacf25a22620620b09200',
        ethProvider: 'https://provider.com',
        eosPrivateKey: 'private key',
        eosSignatureProvider: 'https://provider.com'
      }
    ],
    peosToken: [
      {
        pToken: constants.pTokens.pEOS,
        blockchain: constants.blockchains.Eosio,
        network: constants.networks.Mainnet,
        ethPrivateKey: 'e7c862ea586f7ca20d1d370b30211062fc49066a5b2aacf25a22620620b09200',
        ethProvider: 'https://provider.com',
        eosPrivateKey: 'private key',
        eosSignatureProvider: 'https://provider.com'
      }
    ]
  })
  expect(ptokens.pbtc).to.be.an.instanceof(pBTC)
  expect(ptokens.pltc).to.be.an.instanceof(pLTC)
  expect(ptokens.pweth).to.be.an.instanceof(pERC20)
  expect(ptokens.peth).to.be.an.instanceof(pERC20)
  expect(ptokens.peos).to.be.an.instanceof(pEOSToken)
})
