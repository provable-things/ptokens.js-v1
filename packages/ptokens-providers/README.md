# ptokens-providers

Generic module for doing network calls.

&nbsp;

***

&nbsp;

### Installation:

```
npm install ptokens-providers
```

&nbsp;

***

&nbsp;

### Usage:

```js

import { HttpProvider } from 'ptokens-provider'

const provider = new HttpProvider('endpoint')
provider.call('GET', '/...', [], 10)
```
