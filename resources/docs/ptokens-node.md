# ptokens-node

This is the module that allows to interact with a Validator Node.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-node
```

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

***

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
ptokens.node.getBroadcastTransactionStatus(hash)
```

Gets the status of a broadcasted transaction by the Node. It's possible to pass to the function both an Ethereum transaction hash and an EOS transaction id.

### Parameters

- __`String`__ - __`hash`__: The transaction hash

### Returns

- __`Promise`__ : when resolved, returns the information about a broadcasted transaction by the Node

### Example
```js
ptokens.node.getBroadcastTransactionStatus('0x80b97c8d9676915a0c51c66468eeb1745a6fdd70063f2fb0412fd1e01b7cd083').then(status => console.log(status))
```

&nbsp;

## getIncomingTransactionStatus

```js
ptokens.node.getIncomingTransactionStatus(hash)
```

Gets the status of an incoming transaction to the Node. It's possible to pass to the function both an Ethereum transaction hash and an EOS transaction id

### Parameters

- __`String`__ - __`hash`__: the transaction hash

### Returns

- __`Promise`__ : when resolved returns the information about an incoming transaction to the Node

### Example
```js
ptokens.node.getIncomingTransactionStatus('c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3').then(status => console.log(status))
```

&nbsp;


## getInfo

```js
ptokens.node.getInfo(nativeNetwork, hostNetwork)
```

return info about smart contract address and enclave public key

### Parameters

- __`String`__ - __`nativeNetwork`__: the transaction hash
- __`String`__ - __`hostNetwork`__: the transaction hash

### Returns

- __`Promise`__ : when resolved returns the node infos

### Example
```js
ptokens.node.getInfo('testnet', 'ropsten').then(status => console.log(status))
```

&nbsp;



## getLastProcessedBlock

```js
ptokens.node.getLastProcessedBlock(type)
```

Gets the last processed block by the Node of a given type.

### Parameters

- __`String`__ - __`type`__: type of the block to get. Values can be: `host` and `native`

### Returns

- __`Promise`__ : when resolved returns the last processed block by the Node given its type

### Example
```js
ptokens.node.getLastProcessedBlock('host').then(block => console.log(block))
```

&nbsp;


## getReports

```js
ptokens.node.getReports(type, limit)
```

Gets a report of the transactions relating to the `type` signature nonce supplied. A report is a list of the last `limit` minting/burning transactions. For example in case of `pEOS`, a report of `host` type consists of a list of all burning transactions.

### Parameters

- __`String`__ - __`type`__: type of report to get: Values can be: `host` and `native`
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the report

### Example
```js
ptokens.node.getReports('native', 1).then(report => console.log(report))
```

&nbsp;




## getReportsByAddress

```js
ptokens.node.getReportsByAddress(type, address, limit)
```

Returns all reports given an address

### Parameters

- __`String`__ - __`type`__: type of report to get: Values can be: `host` and `native`
- __`String`__ - __`address`__: `host` or `native` address
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the reports

### Example
```js
ptokens.node.getReportsByAddress('native', '0x1f0b6A3AC984B4c990d8Ce867103E9C384629747', 1).then(report => console.log(report))
```

&nbsp;




## getReportsByNonce

```js
ptokens.node.getReportsByNonce(type, nonce, limit)
```

Returns all reports given a nonce

### Parameters

- __`String`__ - __`type`__: type of report to get: Values can be: `host` and `native`
- __`Number`__ - __`nonce`__: nonce
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the reports

### Example
```js
ptokens.node.getReportsByNonce('native', 1, 1).then(report => console.log(report))
```

&nbsp;



## ping

```js
ptokens.node.ping()
```

Check that the Node is running.

### Returns

- __`Promise`__ : when resolved return a string

### Example
```js
ptokens.node.ping().then(res => console.log(res))
```

&nbsp;


## submitBlock

```js
ptokens.node.submitBlock(type, block)
```

Submit a valid block to the Node specifying its type.

### Parameters

- __`Object`__ - __`type`__: type of the submitted block. Values can be: `native` and `host`
- __`Object`__ - __`block`__: valid block

### Returns

- __`Promise`__ : when resolved returs a string that specify if the submission succedeed

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
ptokens.node.submitBlock('host', block).then(res => console.log(res))
```

&nbsp;