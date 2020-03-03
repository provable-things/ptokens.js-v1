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
  pToken: {
    name: 'pToken name',
    redeemFrom: 'ETH' //for now
  },
  defaultEndpoint: 'https://.....' //optional,
  networkType: 'testnet' //possible values are mainnet, testnet, ropsten, main
})
```