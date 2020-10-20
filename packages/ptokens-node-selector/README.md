# ptokens-node-selector

Module for selecting a validator node

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-node-selector
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { NodeSelector } from 'ptokens-node-selector'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const nodeSelector = new NodeSelector({
  pToken: 'pToken name',
  
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'
  // optionals
  defaultNode: new Node({
    pToken: 'pBTC',
    blockchain: 'ETH',
    provider: new HttpProvider(
      'node endpoint',
      {
        'Access-Control-Allow-Origin': '*',
        ...
      }
    )
  })
})
```