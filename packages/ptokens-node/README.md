# ptokens-node

Module for interacting with a Node.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-node
```

&nbsp;

***

&nbsp;

### Usage:

```js
import Node from 'ptokens-node'

const node = new Node({
  pToken: {
    name: 'pToken name',
    redeemFrom: 'ETH' //for now
  },
  defaultNode: 'https://...' //optional
})
```