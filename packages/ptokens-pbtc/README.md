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

### Usage without injected Web3

```js
const pBTC = require('ptokens-pbtc')

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' // 'testnet' or 'bitcoin', default 'testnet'
})
```

### Usage with injected Web3

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