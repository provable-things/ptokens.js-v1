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
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'

const node = new Node({
  pToken: 'pToken name'
  blockchain: 'ex ETH, EOS',
  provider: new HttpProvider('endpoint', { 'Content-Type': 'application/json', ... })
})
```