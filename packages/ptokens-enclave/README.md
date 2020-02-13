# ptokens-enclave

Module for interacting with the Enclave.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-enclave
```

&nbsp;

***

&nbsp;

### Usage:

```js
import Enclave from 'ptokens-enclave'

const enclave = new Enclave({
  pToken: {
    name: 'pToken name',
    redeemFrom: 'ETH' //for now
  },
  defaultNode: 'https://...' //optional
})
```