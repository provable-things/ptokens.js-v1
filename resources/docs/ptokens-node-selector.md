# ptokens-node-selector

This is the module that allows to instantiate a class for selecting a validator Node

&nbsp;

### Installation

```
npm install ptokens-node-selector
```

&nbsp;

## Usage
In the situation where no default node is in use, the library randomly selects a node among the ones available. Similarly, if the default node (__`defaultEndoint`__) happens to be unavailable during the initialisation process (__`new NodeSelector({...})`__), the library will search for another one. Manual setting of nodes is possible via the __`set`__ function

```js
import { NodeSelector } from 'ptokens-node-selector'

const node = new Node({
  pToken: {
    name: 'pToken name',
    redeemFrom: 'ETH' //for now
  },
  defaultEndpoint: 'https://...' //optional
})
```

&nbsp;

***

&nbsp;

## Class Methods

* __`checkConnection`__
* __`getApi`__
* __`select`__
* __`set`__

***


## checkConnection

```js
nodeSelector.checkConnection(endpoint, timeout)
```

Function to check whether a node is available or not.

### Parameters

- __`String`__ - __`endpoint`__: node endpoint
- __`String`__ - __`timeout`__:  time span (in milliseconds) after which the connection fails

### Returns

- __`Promise`__ : when resolved, a boolean indicating if the node is available.

### Example
```js
nodeSelector.checkConnection('https://....', 1000).then(status => console.log(status))
```

&nbsp;

## getApi

```js
nodeSelector.getApi()
```

Returns an instance of __`AxiosInstance`__ used to perform http requests. If no node is selected, it searches for one.

### Returns

- __`Promise`__ : when resolved returns an instance of __`AxiosInstance`__ 

### Example
```js
nodeSelector.getApi().then(api => api.get('http://...'))
```

&nbsp;


## select

```js
nodeSelector.select()
```

If no default node is used, the first available will be selected (randomly). Similarly, if the default node (__`defaultEndoint`__) is unavailable, it will search for another one.

### Returns

- __`Promise`__ : an instance of __`Node`__

### Example
```js
nodeSelector.select().then(selectedNode => {
  console.log(selectedNode.endpoint)
  selectedNode.api.get('https://...')
})
```

&nbsp;


## set

```js
nodeSelector.set(endpoint)
```

A function that manually sets a specific node.

### Parameters

- __`String`__ - __`endpoint`__: node endpoint

### Returns

- __`Object`__ : an instance of Node

### Example
```js
const selectedNode = nodeSelector.set('https://..')
console.log(selectedNode.endpoint)
selectedNode.api.get('https://...')
```
