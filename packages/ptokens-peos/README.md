# ptokens-peos

Module for interacting only with pEOS.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-peos
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pEOS } from 'ptokens-peos'

const peos = new pEOS({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosRpc: 'EOS RPC Address'
  eosSignatureProvider: 'An EOS Signature Provider',  //if the private key is not passed
  defaultEndpoint: 'https://.....' //optional
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
import { pEOS } from 'ptokens-peos'

if (window.web3) {
  
  const peos = new pEOS({
    ethProvider: window.web3.currentProvider,
    eosSignatureProvider: 'An EOS Signature Provider',  //if the private key is not passed
    defaultEndpoint: 'https://.....' //optional
  })
} else {
  console.log('No web3 detected')
}
```