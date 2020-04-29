import { NodeSelector } from '../src/index'
import { expect } from 'chai'
import { constants } from 'ptokens-utils'

jest.setTimeout(300000)

test('Should select a pBTC node on EOS Jungle3 Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Testnet
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('testnet_jungle3')
  expect(info.host_blockchain).to.be.equal('eosio')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should select a pBTC node on EOS Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('mainnet')
  expect(info.host_blockchain).to.be.equal('eosio')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('mainnet')
})

test('Should select a pBTC node on EOS Jungle3 Testnet with detailed initialization', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    hostBlockchain: constants.blockchains.Eosio,
    hostNetwork: constants.networks.EosioJungle3
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('testnet_jungle3')
  expect(info.host_blockchain).to.be.equal('eosio')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should select a pBTC node on EOS Mainnet with detailed initialization', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    hostBlockchain: constants.blockchains.Eosio,
    hostNetwork: 'mainnet'
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('mainnet')
  expect(info.host_blockchain).to.be.equal('eosio')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('mainnet')
})

test('Should select a pBTC node on Ethereum Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('mainnet')
  expect(info.host_blockchain).to.be.equal('ethereum')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should select a pBTC node on Ethereum Ropsten Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('testnet_ropsten')
  expect(info.host_blockchain).to.be.equal('ethereum')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should not be connected if a node is unreachable on Ethereum', async () => {
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })

  const isConnected = await nodeSelector.checkConnection(unreachableNode, 2000)
  expect(isConnected).to.be.equal(false)
})

test('Should not be connected if a node is unreachable on EOS', async () => {
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Testnet
  })

  const isConnected = await nodeSelector.checkConnection(unreachableNode, 2000)
  expect(isConnected).to.be.equal(false)
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
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })

  try {
    await nodeSelector.setEndpoint(unreachableNode)
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should not select a different node on Ethereum Testnet when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://nuc-bridge-3.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet,
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should not select a different node on Ethereum Mainnet when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://pbtc-node-1a.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should select a different node on Ethereum Ropsten Testnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-2.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet,
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node on EOS Testnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-2.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Testnet,
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node on Ethereum Mainnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-3.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node on Ethereum Testnet when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet,
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})

test('Should select a different node on EOS Testnet when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: constants.pTokens.pBTC,
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Testnet,
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})
