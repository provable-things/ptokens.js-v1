# ptokens-pdoge

Module for interacting only with pDOGE.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-pdoge
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pDOGE } from 'ptokens-pdoge'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const pltc = new pDOGE({
  blockchain: 'ETH',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  // if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'LTC'
  nativeNetwork: 'testnet'

  // optionals
  dogecoinNode: 'dogecoin node endpoint',
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
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