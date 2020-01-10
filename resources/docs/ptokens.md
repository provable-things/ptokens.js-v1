# pTokens

This is the main package which contains all other packages.

### Structure
- __`Object`__ - __`pbtc`__: class for interacting with pEOS token
- __`Object`__ - __`peos`__: class for interacting with pEOS token
- __`Object`__ - __`utils`__: some usefull utilities

### Constructor parameters
- __`Object`__ - __`configs`__: options for initializing a pTokens instance
    - __`Object`__ - __`pbtc`__: options for initializing pBTC
          - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens
          - __`String`__ - __`ethProvider`__: an Ethereum provider
          - __`String`__ - __`btcNetwork`__: Can be `bitcoin` or `testnet`
    - __`Object`__ - __`peos`__: options for initializing pEOS
        - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens
        - __`String`__ - __`ethProvider`__: an Ethereum provider
        - __`String`__ - __`eosPrivateKey`__: an Eos private key used for signing transactions for minting pTokens
        - __`String`__ - __`eosRpc`__: an EOS provider
        - __`String`__ - __`eosSignatureProvider`__: an instance of an already initialized EOS Signature Provider

&nbsp;

### Usage: 

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  peos: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    eosPrivateKey: 'EOS private key',
    eosRpc: 'EOS RPC Address'
    eosSignatureProvider: 'An EOS Signature Provider'  //if the private key is not passed
  },
  pbtc: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    btcNetwork: 'testnet'  //'testnet' or 'bitcoin', default 'testnet'
  }
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const ptokens = new pTokens({
    peos: {
      ethProvider: window.web3.currentProvider,
      ....
    },
    pbtc: {
      ethProvider: window.web3.currentProvider,
      btcNetwork: 'bitcoin'
    }
  })
} else {
  console.log('No web3 detected')
}
```