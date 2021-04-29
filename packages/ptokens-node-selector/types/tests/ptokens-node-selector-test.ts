import { NodeSelector } from 'ptokens-node-selector'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'

const nodeSelector = new NodeSelector({
  pToken: 'pBTC',
  network: 'testnet',
  blockchain: 'ETH'
})

// if you want to be more detailed
const nodeSelector2 = new NodeSelector({
  pToken: 'pBTC',
  hostBlockchain: 'ethereum',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'bitcoin',
  nativeNetwork: 'testnet'
})

// $ExpectType Promise<boolean>
nodeSelector2.checkConnection('https://unreachable-node.io')

// $ExpectType Promise<object>
nodeSelector.getApi()

// $ExpectType Promise<Node>
nodeSelector.select()

// $ExpectType Node
nodeSelector.setSelectedNode('https://unreachable-node.io')

// $ExpectType Node
nodeSelector.setSelectedNode(new Node({
  pToken: 'pbtc',
  blockchain: 'eth',
  provider: new HttpProvider('https://unreachable-node.io'),
}))

// $ExpectType any
nodeSelector.setParams({
  pToken: 'pBTC',
  network: 'testnet',
  blockchain: 'ETH'
})

// $ExpectType Promise<Node[]>
nodeSelector.fetchNodes()
