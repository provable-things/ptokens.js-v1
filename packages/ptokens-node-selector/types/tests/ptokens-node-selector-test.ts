import { NodeSelector } from 'ptokens-node-selector'

const nodeSelector = new NodeSelector({
  pToken: 'pBTC',
  network: 'testnet',
  blockchain: 'ETH',
  defaultEndpoint: 'https://nuc-bridge-2.ngrok.io'
})

// if you want to be more detailed
const nodeSelector2 = new NodeSelector({
  pToken: 'pBTC',
  hostBlockchain: 'ethereum',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'bitcoin',
  nativeNetwork: 'testnet',
  defaultEndpoint: 'https://nuc-bridge-2.ngrok.io'
})

// $ExpectType Promise<boolean>
nodeSelector2.checkConnection('https://unreachable-node.io')

// $ExpectType Promise<object>
nodeSelector.getApi()

// $ExpectType Promise<Node>
nodeSelector.select()

// $ExpectType Node
nodeSelector.setEndpoint('https://unreachable-node.io')
