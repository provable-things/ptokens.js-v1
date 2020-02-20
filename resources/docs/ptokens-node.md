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
  pToken: {
    name: 'pToken name',
    redeemFrom: 'ETH' //for now
  },
  endpoint: 'https://...' //optional
})
```

&nbsp;

***

&nbsp;

## Class Methods

* __`getBroadcastTransactionStatus`__
* __`getIncomingTransactionStatus`__
* __`getInfo`__
* __`getReports`__
* __`getReportsByAddress`__
* __`getReportByNonce`__
* __`getLastProcessedBlock`__
* __`monitorIncomingTransaction`__
* __`ping`__
* __`submitBlock`__

***


## getBroadcastTransactionStatus

```js
node.getBroadcastTransactionStatus(hash)
```

Gets the status of a transaction broadcasted by the Node.

### Parameters

- __`String`__ - __`hash`__: The transaction hash

### Returns

- __`Promise`__ : when resolved, it returns the details of the transaction broadcasted by the Node

### Example
```js
node.getBroadcastTransactionStatus('0x80b97c8d9676915a0c51c66468eeb1745a6fdd70063f2fb0412fd1e01b7cd083').then(report => console.log(report))
```

&nbsp;

## getIncomingTransactionStatus

```js
node.getIncomingTransactionStatus(hash)
```

Gets the status of an incoming transaction to the Node.

### Parameters

- __`String`__ - __`hash`__: the transaction hash

### Returns

- __`Promise`__ : when resolved, it returns the details of the incoming transaction to the Node

### Example
```js
node.getIncomingTransactionStatus('c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3').then(status => console.log(status))
```

&nbsp;


## getInfo

```js
node.getInfo(nativeNetwork, hostNetwork)
```

The function returns the details of the smart contract addess and the enclave public key.

### Parameters

- __`String`__ - __`nativeNetwork`__: the transaction hash
- __`String`__ - __`hostNetwork`__: the transaction hash

### Returns

- __`Promise`__ : when resolved, it returns the node details

### Example
```js
node.getInfo('testnet', 'ropsten').then(info => console.log(info))
```

&nbsp;



## getLastProcessedBlock

```js
node.getLastProcessedBlock(type)
```

Gets the last block of a given type processed by the Node.

### Parameters

- __`String`__ - __`type`__: type of the block to get. Values can be: `host` and `native`

### Returns

- __`Promise`__ : when resolved, it returns the last block of a given type processed by the Node

### Example
```js
node.getLastProcessedBlock('host').then(block => console.log(block))
```

&nbsp;


## getReports

```js
node.getReports(type, limit)
```

Gets a report of the transactions relating to the `type` signature nonce supplied. A report is a list of the last `limit` minting/burning transactions. For example, in the case of __`pBTC`__, a report of __`host`__ type is represented by a list of all transactions involving a token burn.

### Parameters

- __`String`__ - __`type`__: type of report to get. Values can be: `host` and `native`
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the report

### Example
```js
node.getReports('native', 1).then(report => console.log(report))
```

&nbsp;




## getReportsByAddress

```js
node.getReportsByAddress(type, address, limit)
```

Given an address, it returns all reports related to such an address.

### Parameters

- __`String`__ - __`type`__: type of report to get. Values can be: `host` and `native`
- __`String`__ - __`address`__: `host` or `native` address
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the reports

### Example
```js
node.getReportsByAddress('native', '0x1f0b6A3AC984B4c990d8Ce867103E9C384629747', 1).then(report => console.log(report))
```

&nbsp;




## getReportsByNonce

```js
node.getReportsByNonce(type, nonce, limit)
```

Given a nonce, it returns all reports related to such a nonce.

### Parameters

- __`String`__ - __`type`__: type of report to get: Values can be: `host` and `native`
- __`Number`__ - __`nonce`__: nonce
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the reports

### Example
```js
node.getReportsByNonce('native', 1, 1).then(report => console.log(report))
```

&nbsp;



## ping

```js
node.ping()
```

Checks that the Node is running.

### Returns

- __`Promise`__ : when resolved, it returns a string

### Example
```js
node.ping().then(res => console.log(res))
```

&nbsp;


## submitBlock

```js
node.submitBlock(type, block)
```

Submits a valid block to the Node specifying its type.

### Parameters

- __`Object`__ - __`type`__: type of the submitted block. Values can be: `native` and `host`
- __`Object`__ - __`block`__: valid block in JSON format

### Returns

- __`Promise`__ : when resolved, it returns a string that specifies whether the submission of the block was successful

### Example
```js
const block = {
  "number": 3,
  "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
  "nonce": "0xfb6e1a62d119228b",
  "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
  "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
  "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
  "difficulty": '21345678965432',
  "totalDifficulty": '324567845321',
  "size": 616,
  "extraData": "0x",
  "gasLimit": 3141592,
  "gasUsed": 21662,
  "timestamp": 1429287689,
  "transactions": [
      "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
  ],
  "uncles": []
}
node.submitBlock('host', block).then(res => console.log(res))
```

&nbsp;