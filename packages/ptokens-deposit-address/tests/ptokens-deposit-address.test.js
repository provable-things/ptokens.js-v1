import { DepositAddress } from '../src/index'
import { expect } from 'chai'
import Web3 from 'web3'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'
import { constants } from 'ptokens-utils'

const PBTC_ON_ETH_ENDPOINT = 'https://nuc-bridge-3.ngrok.io/'

test('Should generate a pBTC deposit address on Ethereum Ropsten', async () => {
  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    provider: new HttpProvider(PBTC_ON_ETH_ENDPOINT)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: constants.networks.Testnet,
    hostBlockchain: constants.blockchains.Ethereum,
    hostNetwork: constants.networks.Testnet,
    hostApi: new Web3(
      'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6'
    ),
    node
  })

  await depositAddress.generate('0xdf3B180694aB22C577f7114D822D28b92cadFd75')
  expect(depositAddress.verify()).to.be.eq(true)
})
