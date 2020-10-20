# ptokens-providers

### Usage

```js
import { HttpProvider } from 'ptokens-provider'

const provider = new HttpProvider('endpoint')
provider.call('GET', '/...', [], 10)
```

***

## Class Methods

* __`call`__
* __`setEndpoint`__
* __`setHeaders`__

## call

```js
provider.call(callType, apiPath, params, timeout)
```

Make an http call

### Parameters

- __`String`__ - __`callType`__: call type (GET, POST ...)
- __`String`__ - __`apiPath`__: api path
- __`String`__ - __`params`__: POST parameters
- __`String`__ - __`timeout`__: timeout

### Returns

- __`Promise`__ : when resolved returns the response

### Example
```js
provider.call('GET', 'hello/world', [], 1000).then(console.log)
```

***

## setEndpoint


```js
provider.setEndpoint(endpoint)
```

Set a new endpoint for the current provider

### Parameters

- __`String`__ - __`endpoint`__: new endpoint

```js
provider.setEndpoint('https://hello.world/')
```


## setHeaders

```js
provider.setHeaders(headers)
```

Set new headers for the current provider

### Parameters

- __`Object`__ - __`headers`__: new headers

```js
provider.setHeaders({
  'Access-Control-Allow-Methods': 'GET',
  'Content-Type': 'application/json'
})
```

