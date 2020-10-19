import { NodeSelector } from '../src/index'
import { expect } from 'chai'
import { constants } from 'ptokens-utils'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'

jest.setTimeout(300000)

const PBTC_ON_EOS_MAINNET = 'https://pbtconeos-node-1a.ngrok.io'
const PBTC_ON_ETH_MAINNET = 'https://pbtc-node-1a.ngrok.io'
const PBTC_ON_ETH_ROPSTEN = 'https://nuc-bridge-3.ngrok.io'
const PLTC_ON_ETH_ROPSTEN = 'https://nuc-bridge-2.ngrok.io'
const PLTC_ON_EOS_MAINNET = 'https://pltconeos-node-1a.ngrok.io'
const PETH_ON_EOS_MAINNET = 'https://pethoneos-node-1a.ngrok.io'
const UNREACHABLE_NODE = 'https://unreachable-node.io'

test('Should select a pBTC node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinMainnet)
})

test('Should connect to a default node', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet,
    defaultNode: new Node({
      pToken: constants.pTokens.pBTC,
      blockchain: constants.blockchains.Eosio,
      provider: new HttpProvider(PBTC_ON_ETH_MAINNET)
    })
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinMainnet)
})

test('Should select a pBTC node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinMainnet)
})

test('Should select a pLTC node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pLTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Litecoin)
  expect(info.native_network).to.be.equal(constants.networks.LitecoinMainnet)
})

test('Should select a pWETH node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pWETH,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Ethereum)
  expect(info.native_network).to.be.equal(constants.networks.EthereumMainnet)
})

test('Should select a pWETH node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pETH,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Ethereum)
  expect(info.native_network).to.be.equal(constants.networks.EthereumMainnet)
})

test('Should select a pBTC node on EOS Mainnet with detailed initialization', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    hostBlockchain: constants.blockchains.Eosio,
    hostNetwork: constants.networks.Mainnet
  })
  const node = await nodeSelector.setSelectedNode(
    new Node({
      pToken: constants.pTokens.pBTC,
      blockchain: constants.blockchains.Eosio,
      provider: new HttpProvider(PBTC_ON_EOS_MAINNET)
    })
  )
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EosioMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Eosio)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinMainnet)
})

test('Should select a pBTC node on Ethereum Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EthereumMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Ethereum)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinMainnet)
})

test('Should select a pBTC node on Ethereum Ropsten Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EthereumRopsten)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Ethereum)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Bitcoin)
  expect(info.native_network).to.be.equal(constants.networks.BitcoinTestnet)
})

test('Should select a pLTC node on Ethereum Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pLTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })
  const node = await nodeSelector.select()
  const info = await node.getInfo()
  expect(info.host_network).to.be.equal(constants.networks.EthereumMainnet)
  expect(info.host_blockchain).to.be.equal(constants.blockchains.Ethereum)
  expect(info.native_blockchain).to.be.equal(constants.blockchains.Litecoin)
  expect(info.native_network).to.be.equal(constants.networks.LitecoinMainnet)
})

test('Should not be connected if a node is unreachable', async () => {
  const unreachableNode = UNREACHABLE_NODE
  // prettier-ignore
  const expectedErrorMessage = 'Error during checking node connection: getaddrinfo ENOTFOUND unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })
  try {
    await nodeSelector.checkConnection(unreachableNode, 2000)
  } catch (_err) {
    expect(_err.message).to.be.equal(expectedErrorMessage)
  }
})

test('Should generate an error when an invalid pToken name is set', () => {
  const expectedError = 'Invalid pToken name'
  try {
    // eslint-disable-next-line
    new NodeSelector({
      pToken: 'pBTCInvalid',
      blockchain: constants.blockchains.Eosio,
      network: constants.networks.Testnet
    })
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should generate an error when an invalid node is set', async () => {
  const expectedError = 'Node not found or Wrong Feature'
  const unreachableNode = UNREACHABLE_NODE
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })

  try {
    await nodeSelector.setSelectedNode(unreachableNode)
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should not select a different node when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    defaultEndoint: PBTC_ON_ETH_MAINNET
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.provider.endpoint).to.be.equal(PBTC_ON_ETH_MAINNET)
})

test('Should select a different node when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    defaultNode: PLTC_ON_EOS_MAINNET
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.provider.endpoint).to.be.not.equal(PLTC_ON_ETH_ROPSTEN)
})
