# ptokens-perc20

It allows to easily convert any ERC20 tokens on the Ethereum blockchain into their pTokenized equivalents on the another blockchain.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-perc20
```

&nbsp;

***

&nbsp;

### Usage:

```js
import { pERC20 } from 'ptokens-perc20'
import { constants } from 'ptokens-utils'

const perc20 = new pERC20({
  blockchain: 'EOS',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  pToken: constants.pTokens.pWETH,

  // if you want to be more detailed
  hostBlockchain: 'EOS',
  hostNetwork: 'mainnet',
  nativeBlockchain: 'ETH'
  nativeNetwork: 'mainnet'

  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...' // or also an instance of JsonRpc
  eosSignatureProvider: '....' // instance of JsSignatureProvider
})
```