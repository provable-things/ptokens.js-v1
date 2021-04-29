# ptokens-pbep20

It allows to easily convert any BEP20 tokens on the Binance Smart Chain blockchain into their pTokenized equivalents on the another blockchain.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-pbep20
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pBEP20 } from 'ptokens-pbep20'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const pbep20 = new pBEP20({
  blockchain: 'ETH',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  // if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'mainnet',
  nativeBlockchain: 'BSC'
  nativeNetwork: 'mainnet'

  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
  defaultNode: new Node({
    pToken: 'OCP',
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