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

### :zap: Usage : 

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  peos: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  },
  pbtc: {
    ethPrivateKey: 'Eth private key',
    ethProvider: 'Eth provider',
    btcNetwork: 'testnet'  // 'testnet' or 'bitcoin', default 'testnet'
  }
})
```
Instead of using __`ethPrivateKey`__ and __`ethProvider`__ and/or __`eosPrivateKey`__ and __`eosProvider`__ it is possible to pass as a parameter an instance of web3 and/or eosjs (eg. the Web3 instance injected by Metamask).

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const ptokens = new pTokens({
    peos: {
      web3,
      eosjs
    },
    pbtc: {
      web3,
      btcNetwork: 'bitcoin'
    }
  })
} else {
  console.log('No web3 detected')
}
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