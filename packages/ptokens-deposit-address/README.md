# ptokens-deposit-address

Module for generate a deposit address

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-deposit-address
```

&nbsp;

***

&nbsp;

### Usage:

```js

import { DepositAddress } from 'ptokens-deposit-address'

const depositAddress = new DepositAddress({
  nativeBlockchain: 'btc'
  nativeNetwork: 'testnet'
  hostBlockchain: 'eth',
  hostNetwork: 'ropsten_testnet'
})

await depositAddress.generate('host address')
depositAddress.verify()
```
