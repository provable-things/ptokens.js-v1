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
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten', //possible values are testnet_jungle2, testnet_ropsten and mainnet
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  //optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...' //or also an instance of JsonRpc
  eosSignatureProvider: ..
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).
Instead in case the __`hostBlockchain`__ field is equal to __`EOS`__.
It is possible to pass a standard __`JsSignatureProvider`__ as __`eosSignatureProvider`__ and
__`eosRpc`__  can be a __`JsonRpc`__ or a string containing an rpc endpoint.

```js
import { pBTC } from 'ptokens-pbtc'

if (window.web3) {
  
  const pbtc = new pBTC({
    blockchain: 'ETH', //or EOS
    network: 'mainnet',
    ethProvider: window.web3.currentProvider,
    defaultEndpoint: 'https://...' //optional
  })
} else {
  console.log('No web3 detected')
}
```