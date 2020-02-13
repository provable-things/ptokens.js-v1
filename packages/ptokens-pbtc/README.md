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
const pBTC = require('ptokens-pbtc')

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet', //'testnet' or 'bitcoin', default 'testnet'
  defaultNode: 'https://...' //optional
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
const pBTC = require('ptokens-pbtc')

if (window.web3) {
  
  const pbtc = new pBTC({
    ethProvider: window.web3.currentProvider,
    btcNetwork: 'testnet',
    defaultNode: 'https://...' //optional
  })
} else {
  console.log('No web3 detected')
}
```