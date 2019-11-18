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

### Example of Usage:

```js
peos.issue(1, 'eth address')
  .once('onEosTxConfirmed', e => console.log(e))
  .once('onEnclaveReceivedTx', e => console.log(e))
  .once('onEnclaveBroadcastedTx', e => console.log(e))
  .once('onEthTxConfirmed', e => console.log(e))
  .then(r => console.log(r))

peos.redeem(1, 'eos account')
  .once('onEthTxConfirmed', e => console.log(e))
  .once('onEnclaveReceivedTx', e => console.log(e))
  .once('onEnclaveBroadcastedTx', e => console.log(e))
  .once('onEosTxConfirmed', e => console.log(e))
  .then(r => console.log(r))
```