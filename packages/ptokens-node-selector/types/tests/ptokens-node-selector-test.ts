import { NodeSelector } from 'ptokens-node-selector'

const nodeSelector = new NodeSelector({
  pToken: {
    name: 'pBTC',
    redeemFrom: 'ETH'
  },
  defaultEndpoint: 'https://nuc-bridge-2.ngrok.io'
})

// $ExpectType Promise<boolean>
nodeSelector.checkConnection('https://unreachable-node.io')

// $ExpectType Promise<object>
nodeSelector.getApi()

// $ExpectType Promise<Node>
nodeSelector.select()

// $ExpectType Node
nodeSelector.set('https://unreachable-node.io')
