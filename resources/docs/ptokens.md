# pTokens


This is the main module that allows you to instantiate an instance of all available pTokens.


&nbsp;

### Installation

```
npm install ptokens
```

&nbsp;

***

&nbsp;

### Usage

```js
import pTokens from 'ptokens' 

const ptokens = new pTokens({
  pbtc: {
    hostBlockchain: 'ETH', //or EOS
    btcNetwork: 'testnet', //'testnet' or 'bitcoin', default 'testnet'
    //optionals
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    eosPrivateKey: 'Eos Private Key',
    eosRpc: 'https:/...'
    eosSignatureProvider: ..
  }
})
```

It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).
Instead in case the __`hostBlockchain`__ field is equal to __`EOS`__, it is possible to pass a standard __`JsSignatureProvider`__ as __`eosSignatureProvider`__

```js
import pTokens from 'ptokens' 

if (window.web3) {
  
  const ptokens = new pTokens({
    pbtc: {
      hostBlockchain: 'ETH'.
      ethProvider: window.web3.currentProvider,
      btcNetwork: 'bitcoin'
    }
  })
} else {
  console.log('No web3 detected')
}
```

&nbsp;

### Structure
- __`Object`__ - __`pbtc`__: class for interacting with pBTC token
- __`Object`__ - __`utils`__: some usefull utilities

&nbsp;

### Constructor parameters
- __`Object`__ - __`configs`__: options for initializing a pTokens instance
    - __`Object`__ - __`pbtc`__: options for initializing pBTC
          - __`String`__ - __`btcNetwork`__: Can be `bitcoin` or `testnet`
          - __`String`__ - __`hostBlockchain`__: Can be `ETH` or `EOS`
          - __`String`__ - __`ethPrivateKey`__: an Ethereum private key used for signing transactions for redeeming pTokens (this can be null if you pass an already initialized instance of __`ethProvider`__) (Optional)
          - __`String`__ | __`Object`__ - __`ethProvider`__: an Ethereum provider (Optional)
          - __`String`__ - __`defaultNode`__: (Optional)
          - __`String`__ | __`Object`__ - __`eosRpc`__: an EOS rpc address (Optional)
          - __`String`__ | __`Object`__ - __`eosPrivateKey`__: an EOS private key (Optional)
          - __`String`__ | __`Object`__ - __`eosSignatureProvider`__: an EOS signature provider (Optional) 

&nbsp;
