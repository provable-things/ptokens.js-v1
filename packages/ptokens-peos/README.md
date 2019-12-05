# ptokens-peos

Module for interacting only with pEOS.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-peos
```

&nbsp;

***

&nbsp;

### Usage without injected Web3 and Eosjs

```js
const pEOS = require('ptokens-peos')

const peos = new pEOS({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
})
```

### Usage with injected Web3 and/or EosJs

```js
const pEOS = require('ptokens-peos')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const peos = new pEOS({
    web3,
    eosjs //already initialized eosjs instance
  })
} else {
  console.log('No web3 detected')
}
```