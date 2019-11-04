# pTokens

This is the main class which contains all pTokens subclasses.

### Structure
- __`Object`__ - __`peos`__: Object for interacting with pEOS token. 
- __`Object`__ - __`enclave`__: Object for interacting with the Enclave.

### Constructor parameters
- __`Object`__ - __`configs`__: Object containing Ethereum Provider, EOS RPC address, Ethereum and EOS private keys. 
- __`Object`__ - __`web3`__ (optional): Web3 instance already initialized (eg: Web3 instance injected by Metamask). 

### Usage without injected web3

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

### Usage with injected Web3

```js
const pTokens = require('ptokens')

if (window.web3) {
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  }
  const web3 = new Web3(window.web3.currentProvider)
  const ptokens = new pTokens(configs, web3)
} else {
  console.log('No web3 detected')
}
```