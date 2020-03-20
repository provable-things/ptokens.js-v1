import { NodeSelector } from 'ptokens-node-selector'

const nodeSelector = new NodeSelector({
  pToken: {
    name: 'pBTC',
    hostBlockchain: 'ETH'
  },
  defaultEndpoint: 'https://nuc-bridge-2.ngrok.io',
  networkType: 'mainnet'
})

// $ExpectType Promise<boolean>
nodeSelector.checkConnection('https://unreachable-node.io')

// $ExpectType Promise<object>
nodeSelector.getApi()

// $ExpectType Promise<Node>
nodeSelector.select()

// $ExpectType Node
nodeSelector.setEndpoint('https://unreachable-node.io')

// $ExpectType Promise<string>
nodeSelector.getNetworkType()

// $ExpectType string
nodeSelector.setNetworkType('testnet')
