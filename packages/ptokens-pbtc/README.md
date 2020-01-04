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

### Usage 

```js
const pBTC = require('ptokens-pbtc')

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' // 'testnet' or 'bitcoin', default 'testnet'
})
```

Instead of using __`ethPrivateKey`__ and __`ethProvider` it is possible to pass as a parameter an instance of web3 eosjs (eg. the Web3 instance injected by Metamask).

```js
const pBTC = require('ptokens-pbtc')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const pbtc = new pBTC({
    web3,
    btcNetwork: 'testnet' // 'testnet' or 'bitcoin', default 'testnet'
  })
} else {
  console.log('No web3 detected')
}
```