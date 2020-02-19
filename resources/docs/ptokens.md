# pTokens


This is the main module that allows you to instantiate an instance of all available pTokens.

### Structure
- __`Object`__ - __`pbtc`__: class for interacting with pBTC token
- __`Object`__ - __`pltc`__: class for interacting with pLTC token
- __`Object`__ - __`peos`__: class for interacting with pEOS token
- __`Object`__ - __`utils`__: some usefull utilities

### Constructor parameters
- __`Object`__ - __`configs`__: options for initializing a pTokens instance
    - __`Object`__ - __`pbtc`__: options for initializing pBTC
          - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens (this can be null if you pass an already initialized instance of __`ethProvider`__)
          - __`String`__ | __`Object`__ - __`ethProvider`__: an Ethereum provider 
          - __`String`__ - __`btcNetwork`__: Can be `bitcoin` or `testnet`
          - __`String`__ - __`defaultNode`__: (Optional)
     - __`Object`__ - __`pltc`__: options for initializing pBTC
          - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens (this can be null if you pass an already initialized instance of __`ethProvider`__)
          - __`String`__ | __`Object`__ - __`ethProvider`__: an Ethereum provider 
          - __`String`__ - __`ltcNetwork`__: Can be `litecoin` or `testnet`
          - __`String`__ - __`defaultNode`__: (Optional)
    - __`Object`__ - __`peos`__: options for initializing pEOS
        - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens
        - __`String`__ - __`ethProvider`__: an Ethereum provider
        - __`String`__ - __`eosPrivateKey`__: an Eos private key used for signing transactions for minting pTokens
        - __`String`__ - __`eosRpc`__: an EOS provider
        - __`Object`__ - __`eosSignatureProvider`__: an instance of an already initialized EOS Signature Provider (Optional)
        - __`String`__ - __`defaultNode`__: (Optional)

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
  },
  pltc: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    ltcNetwork: 'testnet'  //'testnet' or 'litecoin', default 'testnet'
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