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

### Usage:

```js
const pEOS = require('ptokens-peos')

const peos = new pEOS({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
})
```

Instead of using __`ethPrivateKey`__ and __`ethProvider`__ and/or __`eosPrivateKey`__ and __`eosProvider`__ it is possible to pass as a parameter an instance of __`Web3`__ and/or __`eosjs`__, for example an initialized instance of __`Web3`__ having as provider the one injected by Metamask (__`window.web3.currentProvider`__).

```js
const pEOS = require('ptokens-peos')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const peos = new pEOS({
    web3,
    eosjs
  })
} else {
  console.log('No web3 detected')
}
```