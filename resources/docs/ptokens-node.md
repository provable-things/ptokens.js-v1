# ptokens-node

This module enables the interaction with a Node Validator.

&nbsp;

### Installation

```
npm install ptokens-node
```

&nbsp;

### Usage

```js
import { Node } from 'ptokens-node'

const node = new Node({
  pToken: 'pToken name'
  blockchain: 'ex ETH, EOS',
  endpoint: 'https://...'
})
```

&nbsp;

***

&nbsp;

## Class Methods

* __`ping`__
* __`getPeers`__
* __`getInfo`__
* __`getNativeReports`__
* __`getHostReports`__
* __`getReportsBySenderAddress`__
* __`getReportsByRecipientAddress`__
* __`getReportsByNativeAddress`__
* __`getReportsByHostAddress`__
* __`getReportByIncomingTxHash`__
* __`getReportByBroadcastTxHash`__
* __`getNativeDepositAddress`__
* __`getDepositAddresses`__
* __`getLastProcessedNativeBlock`__
* __`getLastProcessedHostBlock`__
* __`monitorIncomingTransaction`__

***


## ping

```js
node.ping()
```

Ping a node

### Returns

- __`Promise`__: when resolved, it should return `pong`

***

## getPeers

```js
node.getPeers()
```

Get a list of all peers

### Returns

- __`Promise`__: when resolved, it returns all peers

***

## getInfo

```js
node.getInfo()
```

Get the node info

### Returns

- __`Promise`__: when resolved, it returns the node infos

***

## getNativeReports


```js
node.getNativeReports(limit)
```

Get native reports

### Parameters
- __`Integer`__ - __`limit`__: number of reports (default to 100)

### Returns

- __`Promise`__: when resolved, it returns a list of native reports

***

## getHostReports

```js
node.getHostReports(limit)
```

Get host reports

### Parameters
- __`Integer`__ - __`limit`__: number of reports (default to 100)

### Returns

- __`Promise`__: when resolved, it returns a list of host reports

***

## getReportsBySenderAddress

```js
node.getReportsBySenderAddress(address)
```

Get report by sender address

### Parameters
- __`String`__ - __`address`__: sender address

### Returns

- __`Promise`__: when resolved, it returns a list of reports

***

## getReportsByRecipientAddress

```js
node.getReportsByRecipientAddress(address)
```

Get report by recipient address

### Parameters
- __`String`__ - __`address`__: recipient address

### Returns

- __`Promise`__: when resolved, it returns a list of reports

***

## getReportsByNativeAddress

```js
node.getReportsByNativeAddress(address)
```

Get report by native address

### Parameters
- __`String`__ - __`address`__: native address

### Returns

- __`Promise`__: when resolved, it returns a list of reports

***

## getReportsByHostAddress

```js
node.getReportsByHostAddress(address)
```

Get report by host address

### Parameters
- __`String`__ - __`address`__: host address

### Returns

- __`Promise`__: when resolved, it returns a list of reports

***

## getReportByIncomingTxHash

```js
node.getReportByIncomingTxHash(hash)
```

Get report by incoming tx has

### Parameters
- __`String`__ - __`hash`__: tx hash

### Returns

- __`Promise`__: when resolved, it returns the curresponding report

***

## getReportByBroadcastTxHash

```js
node.getReportByBroadcastTxHash(hash)
```

Get report by broadcast tx has

### Parameters
- __`String`__ - __`hash`__: tx hash

### Returns

- __`Promise`__: when resolved, it returns the curresponding report

***

## getNativeDepositAddress

```js
node.getNativeDepositAddress(address)
```

Get a native deposit address. This api is not availabe for all ptokens

### Parameters
- __`String`__ - __`address`__: host address

### Returns

- __`Promise`__: when resolved, it returns the deposit address

***

## getDepositAddresses

```js
node.getDepositAddresses()
```

Get the list of generated deposit addresses for the corresponding pToken


### Returns

- __`Promise`__: when resolved, it returns the generated deposit addresses

***

## getLastProcessedNativeBlock

```js
node.getLastProcessedNativeBlock()
```

Get the last native processed block


### Returns

- __`Promise`__: when resolved, it returns the block number

***

## getLastProcessedHostBlock

```js
node.getLastProcessedHostBlock()
```

Get the last host processed block


### Returns

- __`Promise`__: when resolved, it returns the block number

***

## monitorIncomingTransaction

```js
node.monitorIncomingTransaction(hash, eventEmitter)
```

monitor an incoming tx hash by emitting 2 events: `nodeReceivedTx`, `nodeBrodcastedTx`

### Parameters
- __`String`__ - __`hash`__: incoming tx hash
- __`EventEmitter`__ - __`eventEmitter`__: host address


### Returns

- __`Promise`__: when resolved, it returns the incoming tx report

***
