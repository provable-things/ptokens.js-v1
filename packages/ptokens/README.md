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
import pTokens from 'ptokens'

const ptokens = new pTokens({
  pbtc: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    btcNetwork: 'testnet',  //'testnet' or 'bitcoin', default 'testnet'
    defaultNode: 'https://......' //optional
  }
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const ptokens = new pTokens({
    pbtc: {
      ethProvider: window.web3.currentProvider,
      btcNetwork: 'bitcoin'
    }
  })
} else {
  console.log('No web3 detected')
}
```