# pTokens

This is the main class which contains all pTokens subclasses.

### Structure
- __`Object`__ - __`peos`__: Object for interacting with pEOS token. 
- __`Object`__ - __`enclave`__: Object for interacting with the Enclave.

### Constructor parameters
- __`Object`__ - __`configs`__: Object containing Ethereum Provider, EOS RPC address, Ethereum and EOS private keys or an already initialized instance of Web3 or eosjs. 

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


### Usage with an already initialized Web3 instance
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