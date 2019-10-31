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
import pEOS from 'ptokens-peos'

const configs = {
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
}
const peos = new pEOS(configs)
```

You could also use it with injected web3 instance (eg: MetaMask).

```js
import pEOS from 'ptokens-peos'
import Web3 from 'web3'

if (window.web3) {
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  }
  const web3 = new Web3(window.web3.currentProvider)
  const peos = new pEOS(configs, web3)
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