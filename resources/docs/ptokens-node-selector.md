# ptokens-node-selector

This is the module that allows to instantiate a class for selecting a validator Node

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-node-selector
```

### Usage
If no default node is used, the first available will be selected (randomly). 
If an unavailable node is selected during the initialization (__`new NodeSelector({...})`__), another one will be searched. 
It is also possible to set a node manually using the __`set`__ function

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

***

## Class Methods

* __`checkConnection`__
* __`getApi`__
* __`select`__
* __`set`__

***


## checkConnection

```js
ptokens.nodeSelector.checkConnection(endpoint, timeout)
```

Check if a node is available

### Parameters

- __`String`__ - __`endpoint`__: node endpoint
- __`String`__ - __`timeout`__: timeout (in ms) after which the connection fails

### Returns

- __`Promise`__ : when resolved, a boolean indicating if the node is available

### Example
```js
ptokens.nodeSelector.checkConnection('https://....', 1000).then(status => console.log(status))
```

&nbsp;

## getApi

```js
ptokens.nodeSelector.getApi()
```

Return an instance of __`AxiosInstance`__ used to perform http requests. If no node is selected, it searches for one

### Returns

- __`Promise`__ : when resolved returns an instance of __`AxiosInstance`__ 

### Example
```js
ptokens.nodeSelector.getApi().then(api => api.get('http://...'))
```

&nbsp;


## select

```js
ptokens.nodeSelector.select()
```

Selects a node. If no default node is used (during the initialization), the first available will be selected (randomly). 
If an unavailable node is selected during the initialization (__`new NodeSelector({...})`__), another one will be searched.  

### Returns

- __`Promise`__ : an instance of Node

### Example
```js
ptokens.nodeSelector.select().then(selectedNode => {
  console.log(selectedNode.endpoint)
  selectedNode.api.get('https://...')
})
```

&nbsp;


## set

```js
ptokens.nodeSelector.set(endpoint)
```

Set the selected node manually

### Parameters

- __`String`__ - __`endpoint`__: node endpoint

### Returns

- __`Object`__ : an instance of Node

### Example
```js
const selectedNode = ptokens.nodeSelector.set('https://..')
console.log(selectedNode.endpoint)
selectedNode.api.get('https://...')
```
