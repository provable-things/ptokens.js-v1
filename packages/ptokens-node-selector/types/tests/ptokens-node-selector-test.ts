import { NodeSelector } from 'ptokens-node-selector'

const nodeSelector = new NodeSelector({
  pToken: {
    name: 'pBTC',
    redeemFrom: 'ETH'
  }
})

// $ExpectType Promise<boolean>
nodeSelector.checkConnection('https://unreachable-node.io')

// $ExpectType Promise<object>
nodeSelector.getApi()

// $ExpectType Promise<SelectedNode>
nodeSelector.select()

// $ExpectType Promise<SelectedNode>
nodeSelector.set('https://unreachable-node.io')
