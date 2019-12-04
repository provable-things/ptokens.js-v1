# ptokens

Main module for interacting with pTokens. 

The documentation is available [here](#).

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens
```

&nbsp;

***

&nbsp;

### Usage without injected Web3 and Eosjs

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
})
```

### :syringe: Usage with injected Web3 and/or EosJs

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const ptokens = new pTokens({
    web3,
    eosjs //already initialized eosjs instance
  })
} else {
  console.log('No web3 detected')
}
```