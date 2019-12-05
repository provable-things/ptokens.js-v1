# pTokens

This is the main package which contains all other packages.

### Structure
- __`Object`__ - __`peos`__: class for interacting with pEOS token
- __`Object`__ - __`enclave`__: class for interacting with the Enclave
- __`Object`__ - __`utils`__: some usefull utilities

### Constructor parameters
- __`Object`__ - __`configs`__: options for initializing an pTokens instance
    - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens
    - __`String`__ - __`ethProvider`__: an Ethereum provider
    - __`String`__ - __`eosPrivateKey`__: an Eos private key used for signing transactions for minting pTokens
    - __`String`__ - __`eosProvider`__: an EOS provider
    - __`Object`__ - __`web3`__: an already initialized web3 instance (don't use `ethPrivateKey` and `ethProvider` if this option is used)
    - __`String`__ - __`eosjs`__: an already initialized eosjs instance (don't use `eosPrivateKey` and `eosProvider` if this option is used)

&nbsp;

### Usage without an already initialized Web3 and eosjs instance

```js
const pTokens = require('ptokens')

const configs = {
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
}
const ptokens = new pTokens(configs)
```

&nbsp;

### Usage with an already initialized Web3 instance (eg: injected by Metamask)

```js
const pTokens = require('ptokens')

if (window.web3) {
  const web3 = new Web3(window.web3.currentProvider)
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
    web3
  }
  
  const ptokens = new pTokens(configs)
} else {
  console.log('No web3 detected')
}
```
&nbsp;

### Usage with an already initialized eosjs instance

```js
const pTokens = require('ptokens')

const eosjs = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(), 
  textEncoder: new TextEncoder() 
})

const web3 = new Web3(window.web3.currentProvider)
const configs = {
  eosjs
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
}
  
const ptokens = new pTokens(configs)
```
&nbsp;

### Usage with Web3 and eosjs instances already initialized

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const eosjs = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(), 
    textEncoder: new TextEncoder() 
  })

  const web3 = new Web3(window.web3.currentProvider)
  const configs = {
    eosjs
    web3
  }
  
  const ptokens = new pTokens(configs)
} else {
  console.log('No web3 detected')
}
```