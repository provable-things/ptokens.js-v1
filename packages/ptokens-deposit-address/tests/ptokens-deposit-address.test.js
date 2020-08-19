import { DepositAddress } from '../src/index'
import { expect } from 'chai'
import Web3 from 'web3'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'
import { eos, constants } from 'ptokens-utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const PBTC_ON_ETH_MAINNET = 'https://pbtc-node-1a.ngrok.io'
const PBTC_ON_EOS_MAINNET = 'https://pbtconeos-node-1a.ngrok.io'
const PBTC_ON_ETH_ROPSTEN = 'https://nuc-bridge-3.ngrok.io/'

// prettier-ignore
const INFURA_MAINNET = 'https://mainnet.infura.io/v3/4762c881ac0c4938be76386339358ed6'
// prettier-ignore
const INFURA_ROPSTEN = 'https://mainnet.infura.io/v3/4762c881ac0c4938be76386339358ed6'
const EOS_MAINNET_NODE = 'https://eos-mainnet-4.ptokens.io'

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
const EOS_TESTING_ACCOUNT = 'all3manfr3di'

test('Should generate correctly a pBTC deposit address on Ethereum Mainnet', async () => {
  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    provider: new HttpProvider(PBTC_ON_ETH_MAINNET)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: constants.networks.BitcoinMainnet,
    hostBlockchain: constants.blockchains.Ethereum,
    hostNetwork: constants.networks.EthereumMainnet,
    hostApi: new Web3(INFURA_MAINNET),
    node
  })

  await depositAddress.generate(ETH_TESTING_ADDRESS)
  expect(depositAddress.verify()).to.be.eq(true)
})

test('Should NOT generate correctly a pBTC deposit address on Ethereum Mainnet', async () => {
  const wrongNativeNetwork = constants.networks.BitcoinTestnet

  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    provider: new HttpProvider(PBTC_ON_ETH_MAINNET)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: wrongNativeNetwork,
    hostBlockchain: constants.blockchains.Ethereum,
    hostNetwork: constants.networks.EthereumMainnet,
    hostApi: new Web3(INFURA_MAINNET),
    node
  })

  await depositAddress.generate(ETH_TESTING_ADDRESS)
  expect(depositAddress.verify()).to.be.eq(false)
})

test('Should generate correctly a pBTC deposit address on Ethereum Ropsten', async () => {
  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    provider: new HttpProvider(PBTC_ON_ETH_ROPSTEN)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: constants.networks.BitcoinTestnet,
    hostBlockchain: constants.blockchains.Ethereum,
    hostNetwork: constants.networks.EthereumRopsten,
    hostApi: new Web3(INFURA_ROPSTEN),
    node
  })

  await depositAddress.generate(ETH_TESTING_ADDRESS)
  expect(depositAddress.verify()).to.be.eq(true)
})

test('Should NOT generate correctly a pBTC deposit address on Ethereum Ropsten', async () => {
  const wrongNativeNetwork = constants.networks.BitcoinMainnet

  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    provider: new HttpProvider(PBTC_ON_ETH_ROPSTEN)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: wrongNativeNetwork,
    hostBlockchain: constants.blockchains.Ethereum,
    hostNetwork: constants.networks.EthereumRopsten,
    hostApi: new Web3(INFURA_ROPSTEN),
    node
  })

  await depositAddress.generate(ETH_TESTING_ADDRESS)
  expect(depositAddress.verify()).to.be.eq(false)
})

test('Should generate correctly a pBTC deposit address on Eos Mainnet', async () => {
  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    provider: new HttpProvider(PBTC_ON_EOS_MAINNET)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: constants.networks.BitcoinMainnet,
    hostBlockchain: constants.blockchains.Eosio,
    hostNetwork: constants.networks.EosioMainnet,
    hostApi: eos.getApi(null, new JsonRpc(EOS_MAINNET_NODE, { fetch }), null),
    node
  })

  await depositAddress.generate(EOS_TESTING_ACCOUNT)
  expect(depositAddress.verify()).to.be.eq(true)
})

test('Should NOT generate correctly a pBTC deposit address on Eos Mainnet', async () => {
  const wrongNativeNetwork = constants.networks.BitcoinTestnet

  const node = new Node({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    provider: new HttpProvider(PBTC_ON_EOS_MAINNET)
  })

  const depositAddress = new DepositAddress({
    nativeBlockchain: constants.blockchains.Bitcoin,
    nativeNetwork: wrongNativeNetwork,
    hostBlockchain: constants.blockchains.Eosio,
    hostNetwork: constants.networks.EosioMainnet,
    hostApi: eos.getApi(null, new JsonRpc(EOS_MAINNET_NODE, { fetch }), null),
    node
  })

  await depositAddress.generate(EOS_TESTING_ACCOUNT)
  expect(depositAddress.verify()).to.be.eq(false)
})
