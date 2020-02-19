# ptokens-pltc

Module for interacting only with pLTC.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-pltc
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pLTC } from 'ptokens-pltc'

const pltc = new pLTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  ltcNetwork: 'testnet', //can be 'litecoin' or 'testnet'. default 'testnet'
  defaultNode: 'https://...' //optional
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
import { pLTC } from 'ptokens-pltc'

if (window.web3) {
  
  const pltc = new pLTC({
    ethProvider: window.web3.currentProvider,
    ltcNetwork: 'testnet',
    defaultNode: 'https://...' //optional
  })
} else {
  console.log('No web3 detected')
}
```