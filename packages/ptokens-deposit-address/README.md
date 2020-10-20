# ptokens-deposit-address

Module to generate a deposit address

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
if (!depositAddress.verify()) {
  console.error('Node deposit address does not match expected address')
}
```
