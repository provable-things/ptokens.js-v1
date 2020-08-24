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
})