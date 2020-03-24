import { NodeSelector } from '../src/index'
import { expect } from 'chai'

jest.setTimeout(300000)

test('Should select a pBTC node on EOS Jungle2 Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'EOS',
    network: 'testnet'
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('testnet_jungle2')
  expect(info.host_blockchain).to.be.equal('eos')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should select a pBTC node on EOS Jungle2 Testnet with detailed initialization', async () => {
  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    hostBlockchain: 'EOS',
    hostNetwork: 'testnet_jungle2'
  })

  const node = await nodeSelector.select()
  const info = await node.getInfo()

  expect(info.host_network).to.be.equal('testnet_jungle2')
  expect(info.host_blockchain).to.be.equal('eos')
  expect(info.native_blockchain).to.be.equal('bitcoin')
  expect(info.native_network).to.be.equal('testnet')
})

test('Should select a pBTC node on Ethereum Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'mainnet'
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
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet'
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
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet'
  })

  const isConnected = await nodeSelector.checkConnection(unreachableNode, 2000)
  expect(isConnected).to.be.equal(false)
})

test('Should not be connected if a node is unreachable on EOS', async () => {
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'EOS',
    network: 'testnet'
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
      blockchain: 'EOS',
      network: 'testnet'
    })
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should generate an error when an invalid node is set', async () => {
  const expectedError = 'Node not found or Wrong Feature'
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet'
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
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet',
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should not select a different node on Ethereum Mainnet when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://pbtc-node-1a.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'mainnet',
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should select a different node on Ethereum Ropsten Testnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-2.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet',
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
    pToken: 'pBTC',
    blockchain: 'EOS',
    network: 'testnet',
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
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'mainnet',
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
    pToken: 'pBTC',
    blockchain: 'ETH',
    network: 'testnet',
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})

test('Should select a different node on EOS Testnet when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: 'pBTC',
    blockchain: 'EOS',
    network: 'testnet',
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})
