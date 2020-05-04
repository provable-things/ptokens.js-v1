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
    blockchain: 'ETH', // or EOS
    network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

    // if you want to be more detailed
    hostBlockchain: 'ETH',
    hostNetwork: 'testnet_ropsten', // possible values are testnet_jungle2, testnet_ropsten and mainnet
    nativeBlockchain: 'BTC'
    nativeNetwork: 'testnet'

    // optionals
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider', // or instance of Web3 provider
    eosPrivateKey: 'Eos Private Key',
    eosRpc: 'https:/...' // or also an instance of JsonRpc
    eosSignatureProvider: '....' // instance of JsSignatureProvider
  }
})
```

&nbsp;

It's possible to have more instances of __`pBTC`__:

```js
import pTokens from 'ptokens'

const ptokens = new pTokens({
  pbtc: [
    {
      blockchain: 'ETH',
      network: 'mainnet'
    },
    {
      blockchain: 'EOS',
      network: 'mainnet'
    }
  ]
})