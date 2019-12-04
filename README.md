<img src="./resources/docs/img/ptokens-js.png" width="150" height="150">

# ptokens.js | pTokens Javascript API

Javascript module for interacting with pTokens.

The documentation is available [here](#).

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

### :zap: Usage without injected Web3 and Eosjs

```js
const pTokens = require('ptokens')

const ptokens = new pTokens({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
})
```

### :syringe: Usage with injected Web3 and/or EosJs

```js
const pTokens = require('ptokens')

if (window.web3) {
  
  const web3 = new Web3(window.web3.currentProvider)

  const ptokens = new pTokens({
    web3,
    eosjs //already initialized eosjs instance
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