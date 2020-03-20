import { NodeSelector } from '../src/index'
import { expect } from 'chai'
import Web3 from 'web3'

jest.setTimeout(300000)

const ETH_TESTNET_PROVIDER =
  'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6'
const ETH_UNSUPPORTED_TESTNET_PROVIDER =
  'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6'
const ETH_MAINNET_PROVIDER =
  'https://mainnet.infura.io/v3/4762c881ac0c4938be76386339358ed6'

test('Should select a pBTC node on Ethereum Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })

  const node = await nodeSelector.select()
  // eslint-disable-next-line
  expect(node.endpoint).to.be.not.null
})

test('Should select a pBTC node on Ethereum Mainnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'mainnet'
  })

  const node = await nodeSelector.select()
  // eslint-disable-next-line
  expect(node.endpoint).to.be.not.null
})

test('Should generate an error when an unsupported network is provided', async () => {
  const expectedError = 'Invalid Network Type'
  const web3 = new Web3(ETH_UNSUPPORTED_TESTNET_PROVIDER)

  try {
    const nodeSelector = new NodeSelector({
      pToken: {
        name: 'pBTC',
        redeemFrom: 'ETH'
      },
      networkType: web3.eth.net.getNetworkType()
    })
    await nodeSelector.select()
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should select a pBTC node on Ethereum Testnet', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })

  const node = await nodeSelector.select()
  // eslint-disable-next-line
  expect(node.endpoint).to.be.not.null
})

test('Should not be connected if a node is unreachable', async () => {
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })

  const isConnected = await nodeSelector.checkConnection(unreachableNode, 2000)
  expect(isConnected).to.be.equal(false)
})

test('Should generate an error when an invalid pToken name is set', () => {
  const expectedError = 'Invalid pToken'

  try {
    // eslint-disable-next-line
    new NodeSelector({
      pToken: {
        name: 'invalid name',
        redeemFrom: 'ETH'
      },
      networkType: 'testnet'
    })
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should generate an error when an invalid node is set', async () => {
  const expectedError = 'Node not found or Wrong Feature'
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })

  try {
    await nodeSelector.setEndpoint(unreachableNode)
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should not select a different node on Testnet when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://nuc-bridge-3.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet',
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should not select a different node on Mainnet when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://pbtc-node-1a.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'mainnet',
    defaultEndoint: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should select a different node on Testnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-2.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet',
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node on Mainnet when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-3.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'mainnet',
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node on Testnet when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet',
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})

test('Should select a different node on Mainnet when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'mainnet',
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})

test('Should always return network type equal to Mainnet', async () => {
  const expectedNetworkType = 'mainnet'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'mainnet'
  })
  let networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)

  nodeSelector.setNetworkType('bitcoin')
  networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)

  nodeSelector.setNetworkType('mainnet')
  networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)
})

test('Should always return network type equal to Testnet', async () => {
  const expectedNetworkType = 'testnet'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })
  let networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)

  nodeSelector.setNetworkType('ropsten')
  networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)

  nodeSelector.setNetworkType('testnet')
  networkType = await nodeSelector.getNetworkType()
  expect(networkType).to.be.equal(expectedNetworkType)
})

test('Should generate an error when an invalid network type is set', () => {
  const expectedError = 'Invalid Network Type'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    },
    networkType: 'testnet'
  })
  try {
    nodeSelector.setNetworkType('invalid')
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})
