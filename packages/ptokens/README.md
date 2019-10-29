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

### Usage:

```js
import pTokens from 'ptokens'

const configs = {
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
}
const ptokens = new pTokens(configs)
```

You could also use it with injected web3 instance (eg: MetaMask).

```js
import pTokens from 'ptokens'
import Web3 from 'web3'

if (window.web3) {
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  }
  const web3 = new Web3(window.web3.provider)
  const ptokens = new pTokens(configs, web3)
}
```