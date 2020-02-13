import NodeSelector from '../src/index'
import { expect } from 'chai'

jest.setTimeout(300000)

test('Should select a pBTC node on Ethereum', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pBTC',
      redeemFrom: 'ETH'
    }
  })

  const node = await nodeSelector.select()
  expect(node.endpoint).to.be.not.null
})

test('Should select a pEOS node on Ethereum', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pEOS',
      redeemFrom: 'ETH'
    }
  })

  const node = await nodeSelector.select()
  expect(node.endpoint).to.be.not.null
})

test('Should select a pLTC node on Ethereum', async () => {
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const node = await nodeSelector.select()
  expect(node.endpoint).to.be.not.null
})

test('Should not be connected if a node is unreachable', async () => {
  const unreachableNode = 'https://unreachable-node.io'
  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  const isConnected = await nodeSelector.checkConnection(unreachableNode, 2000)
  expect(isConnected).to.be.equal(false)
})

test('Should generate an error when an invalid pToken name is set', async () => {
  const expectedError = 'Invalid pToken'

  try {
    new NodeSelector({
      pToken: {
        name: 'invalid name',
        redeemFrom: 'ETH'
      }
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
      name: 'pLTC',
      redeemFrom: 'ETH'
    }
  })

  try {
    await nodeSelector.set(unreachableNode)
  } catch (err) {
    expect(err.message).to.be.equal(expectedError)
  }
})

test('Should not select a different node when a valid one is set as default and it is compatibile with the selected pToken', async () => {
  const reachableNode = 'https://nuc-bridge-3.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    },
    defaultNode: reachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.equal(reachableNode)
})

test('Should select a different node when a valid one is set as default but it is not compatibile with the selected pToken', async () => {
  const reachableNodeButNotCompatibleWithSelectedpToken =
    'https://nuc-bridge-2.ngrok.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    },
    defaultNode: reachableNodeButNotCompatibleWithSelectedpToken
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(
    reachableNodeButNotCompatibleWithSelectedpToken
  )
})

test('Should select a different node when an invalid one is set as default', async () => {
  const unreachableNode = 'https://unreachable-node.io'

  const nodeSelector = new NodeSelector({
    pToken: {
      name: 'pLTC',
      redeemFrom: 'ETH'
    },
    defaultNode: unreachableNode
  })
  const selectedNode = await nodeSelector.select()
  expect(selectedNode.endpoint).to.be.not.equal(unreachableNode)
})
