# ptokens-prvn

Module for interacting only with pRVN.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-prvn
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pRVN } from 'ptokens-prvn'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'
import { constants } from 'ptokens-utils'

const { blockchains, networks, pTokens } = constants

const prvn = new pRVN({
  blockchain: blockchains.BinanceSmartChain,
  network: networks.Mainnet, // 'testnet' or 'mainnet', default 'testnet'

  // if you want to be more detailed
  hostBlockchain: blockchains.BinanceSmartChain,,
  hostNetwork: networks.BinanceSmartChainNetwork,
  nativeBlockchain: blockchains.Ravencoin,
  nativeNetwork: blockchains.RavenCoinMainnet

  // optionals
  bscPrivateKey: 'BSC private key',
  bscProvider: 'BSC provider', // or instance of Web3 provider
  defaultNode: new Node({
    pToken: pTokens.pRVN,
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