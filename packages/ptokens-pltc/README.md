# ptokens-pltc

Module for interacting only with pLTC.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-pltc
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pLTC } from 'ptokens-pltc'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const pltc = new pLTC({
  blockchain: 'ETH',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  // if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'LTC'
  nativeNetwork: 'testnet'

  // optionals
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