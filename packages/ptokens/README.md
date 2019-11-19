# ptokens

Main module for interacting with pTokens

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

### Usage without injected web3

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
})
```

### Usage with injected Web3 and/or EosJs

```js
const pTokens = require('ptokens')

const eosjs = ScatterJS.eos(network, Api, { rpc }) //for instance the Scatter one

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const ptokens = new pTokens({
    web3,
    eosjs
  })
} else {
  console.log('No web3 detected')
}
```

### Example of Usage:

```js
ptokens.peos.issue(1, 'eth address')
  .once('onEosTxConfirmed', e => console.log(e))
  .once('onEnclaveReceivedTx', e => console.log(e))
  .once('onEnclaveBroadcastedTx', e => console.log(e))
  .once('onEthTxConfirmed', e => console.log(e))
  .then(r => console.log(r))

ptokens.peos.redeem(1, 'eos account')
  .once('onEthTxConfirmed', e => console.log(e))
  .once('onEnclaveReceivedTx', e => console.log(e))
  .once('onEnclaveBroadcastedTx', e => console.log(e))
  .once('onEosTxConfirmed', e => console.log(e))
  .then(r => console.log(r))
```