# ptokens

Main module for interacting with pTokens. 

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

### Usage: 

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  peos: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  },
  pbtc: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    btcNetwork: 'testnet'  // 'testnet' or 'bitcoin', default 'testnet'
  }
})
```
Instead of using __`ethPrivateKey`__ and __`ethProvider`__ and/or __`eosPrivateKey`__ and __`eosProvider`__ it is possible to pass as a parameter an instance of __`Web3`__ and/or __`eosjs`__, for example an initialized instance of __`Web3`__ having as provider the one injected by Metamask (__`window.web3.currentProvider`__).

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const ptokens = new pTokens({
    peos: {
      web3,
      eosjs
    },
    pbtc: {
      web3,
      btcNetwork: 'bitcoin'
    }
  })
} else {
  console.log('No web3 detected')
}
```