# ptokens-pbtc

Module for interacting only with pBTC.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-pbtc
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pBTC } from 'ptokens-pbtc'

const pbtc = new pBTC({
  blockchain: 'ETH', // or EOS
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  // if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten', // possible values are testnet_jungle2, testnet_ropsten and mainnet
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  // optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...' // or also an instance of JsonRpc
  eosSignatureProvider: '....' // instance of JsSignatureProvider
})
```