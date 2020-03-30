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

const nodeSelector = new NodeSelector({
  pToken: 'pToken name',
  
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  defaultEndpoint: 'https://.....' //optional
})
```