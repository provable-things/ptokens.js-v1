<img src="./resources/docs/img/ptokens-js.png" width="150" height="150">

# ptokens.js | pTokens Javascript API

Javascript module for interacting with pTokens.

&nbsp;

***

&nbsp;

### :rocket: Installation:

```
npm install ptokens
```

&nbsp;

***

&nbsp;

### :zap: Usage: 

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
```

&nbsp;

### Example of generating a pBTC Deposit Address on Ethereum

```js
const depositAddress = await ptokens.pbtc.getDepositAddress(ethAddress)

console.log(depositAddress.toString())
    
//fund the BTC address just generated (not ptokens.js stuff)

depositAddress.waitForDeposit()
  .once('nativeTxBroadcasted', tx => ... )
  .once('nativeTxConfirmed', tx => ...)
  .once('nodeReceivedTx', tx => ...)
  .once('nodeBroadcastedTx', tx => ...)
  .once('hostTxConfirmed', tx => ...)
  .then(res => ...))
```

&nbsp;

***

&nbsp;

### :house_with_garden: Environment setup:

Clone the __`ptokens.js`__ repo:

```
git clone https://github.com/provable-things/ptokens.js.git
```

Switch into the __`ptokens.js`__:

```
cd ptokens.js
```

Install and link dependencies:

```
npm run init
```

Build all packages

```
npm run build
```

Bootstrap all packages

```
npm run bootstrap
```

&nbsp;

***

&nbsp;

### :guardsman: Tests:

```
npm run test
```

&nbsp;

***

&nbsp;

### :page_with_curl: Run and Build the documentation:

Please be sure to have installed [__`mkdocs`__](https://www.mkdocs.org/), [__`python 2.7`__](https://www.python.org/) and __`pip`__.

Switch into __`resources`__ folder:

```
cd resources
```

If you want to run the documentation locally:

```
mkdocs serve
```

If you want to build the documentation:

```
mkdocs build
```