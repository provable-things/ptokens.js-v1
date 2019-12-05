# ptokens-enclave

This is the module that allows to interact with the Enclave.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-enclave
```

***

## Class Methods

* __`getBroadcastTransactionStatus`__
* __`getIncomingTransactionStatus`__
* __`getLastProcessedBlock`__
* __`getReport`__
* __`ping`__
* __`submitBlock`__

***


## getBroadcastTransactionStatus

```js
ptokens.enclave.getBroadcastTransactionStatus(hash)
```

Gets the status of a broadcasted transaction by the Enclave. It's possible to pass to the function both an Ethereum transaction hash and an EOS transaction id.

### Parameters

- __`String`__ - __`hash`__: The transaction hash

### Returns

- __`Promise`__ : when resolved, returns the information about a broadcasted transaction by the Enclave

### Example
```js
> ptokens.enclave.getBroadcastTransactionStatus('0x80b97c8d9676915a0c51c66468eeb1745a6fdd70063f2fb0412fd1e01b7cd083').then(status => console.log(status))
> {
    _id: 'EOS 718',
    eos_amount: null,
    broadcast: true,
    peos_sender: null,
    eos_recipient: null,
    eth_latest_nonce: null,
    broadcast_timestamp: 1572869766,
    eth_latest_block_num: null,
    eos_sender: 'all3manfr4di',
    peos_amount: '10000',
    eos_signed_transactions: null,
    broadcast_transaction_hash:
    '0x80b97c8d9676915a0c51c66468eeb1745a6fdd70063f2fb0412fd1e01b7cd083',
    eos_latest_nonce: 718,
    eth_signed_transactions:
    { sender: 'all3manfr4di',
      nonce: 718,
      amount: '10000',
      incomingTxId:
        'e794eb61a04388c7bb011d3e95a818f5215eb6d7dd81528ed72a7667f5bc7e31',
      recipient: '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF',
      ethAccountNonce: 477,
      transaction:
        '0xf8ac8201dd8504a817c800830493e0944aeafc6f72ed16665a70a45297500a0bd9d8c2f080b84440c10f19000000000000000000000000612deb505e4a26729c0a2f49c622d036db3ad5bf000000000000000000000000000000000000000000000000000000000000271078a06692fb3b6326c05412491d582535b768949b804fd42e612920315f4fb8919d4fa04f16ef0772ba3b44e72479f84896a6db7f066f298b4dbdf9c89da09fdd526333' },
    peos_recipient: '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF',
    eos_latest_block_num: 58320875,
    last_used_nonce_temp: 477,
    incoming_transaction_hash:
    'e794eb61a04388c7bb011d3e95a818f5215eb6d7dd81528ed72a7667f5bc7e31',
    witnessed_timestamp: 1572869765 
  }
```

&nbsp;

## getIncomingTransactionStatus

```js
ptokens.enclave.getIncomingTransactionStatus(hash)
```

Gets the status of an incoming transaction to the Enclave. It's possible to pass to the function both an Ethereum transaction hash and an EOS transaction id

### Parameters

- __`String`__ - __`hash`__: the transaction hash

### Returns

- __`Promise`__ : when resolved returns the information about an incoming transaction to the Enclave

### Example
```js
> ptokens.enclave.getIncomingTransactionStatus('c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3').then(status => console.log(status))
> { 
    _id: 'EOS 303',
    eos_amount: null,
    broadcast: true,
    peos_sender: null,
    eos_recipient: null,
    eth_latest_nonce: null,
    broadcast_timestamp: 1571216519,
    eth_latest_block_num: null,
    eos_sender: 'all3manfr3di',
    peos_amount: '22223',
    eos_signed_transactions: null,
    broadcast_transaction_hash:
    '0x61a2b4538d63c189864501e879b99a98fbbc69018d0d2044d4c693921d2bec07',
    eos_latest_nonce: 303,
    eth_signed_transactions:
    { sender: 'all3manfr3di',
      nonce: 303,
      amount: '22223',
      incomingTxId:
        'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3',
      recipient: '0x026dC6A43561DA8A6A775538b192A3e936c0F29B',
      ethAccountNonce: 159,
      transaction:
        '0xf8ab819f8504a817c800830493e0944aeafc6f72ed16665a70a45297500a0bd9d8c2f080b84440c10f19000000000000000000000000026dc6a43561da8a6a775538b192a3e936c0f29b00000000000000000000000000000000000000000000000000000000000056cf77a0f9d063bbd7550c64b184664fabf7b5e34ada8fcf94c9769140d9e38aeb4cf5a1a02863b801a438d8b9d44af9d617651162c0d1b1885dcdcf684515cec94bf9da75' },
    peos_recipient: '0x026dC6A43561DA8A6A775538b192A3e936c0F29B',
    eos_latest_block_num: 55033992,
    last_used_nonce_temp: 159,
    incoming_transaction_hash:
    'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3',
    witnessed_timestamp: 1571216518 
  }
```

&nbsp;



## getLastProcessedBlock

```js
ptokens.enclave.getLastProcessedBlock(type)
```

Gets the last processed block by the Enclave of a given type.

### Parameters

- __`String`__ - __`type`__: type of the block to get. Values can be: `eth` and `eos`

### Returns

- __`Promise`__ : when resolved returns the last processed block by the Enclave given its type

### Example
```js
> ptokens.enclave.getLastProcessedBlock('eth').then(block => console.log(block))
> { 
    _id: 'last-seen-eth-block',
    latestBlockNum: 14585227 
  }
```

&nbsp;


## getReport

```js
ptokens.enclave.getReport(type, limit)
```

Gets a report of the transactions relating to the `type` signature nonce supplied. A report is a list of the last `limit` minting/burning transactions. For example in case of `pEOS`, a report of `eth` type consists of a list of all burning transactions.

### Parameters

- __`String`__ - __`type`__: type of report to get: Values can be: `eth` and `eos`
- __`Number`__ - __`limit`__: maximum number of reports to be received. The default value is set to `100`

### Returns

- __`Promise`__ : when resolved returns the report

### Example
```js
> ptokens.enclave.getReport('eth', 1).then(report => console.log(report))
> [ 
    { _id: 'ETH 522',
      broadcast: true,
      eos_sender: null,
      peos_amount: null,
      peos_recipient: null,
      eos_latest_nonce: null,
      broadcast_timestamp: 1572645875,
      eos_latest_block_num: null,
      eth_signed_transactions: null,
      broadcast_transaction_hash:
      '5ee8b6e2f9a646b2ceff5dd51cfbd1f071fab9bec60e4701f6f97ab87889cf1a',
      eos_signed_transactions: [ [Object] ],
      eth_latest_block_num: 14530159,
      eos_amount: '0.1234 EOS',
      peos_sender: '0x53c2048dad4fcfab44c3ef3d16e882b5178df42b',
      witnessed_timestamp: 1572645874,
      eth_latest_nonce: 522,
      eos_recipient: 'provtestable',
      incoming_transaction_hash:
      '0x4c3fd580116393d9d209bc334b058573f8bcf58d5ed3a1046a3c016f82630897'
    } 
  ]
```

&nbsp;



## ping

```js
ptokens.enclave.ping()
```

Check that the Enclave is running.

### Returns

- __`Promise`__ : when resolved return this sring: `Provable Pong`

### Example
```js
> ptokens.enclave.ping().then(res => console.log(res))
> Provable pong!
```

&nbsp;


## submitBlock

```js
ptokens.enclave.submitBlock(type, block)
```

Submit a valid block to the Enclave specifying its type.

### Parameters

- __`Object`__ - __`type`__: type of the submitted block. Values can be: `eth` and `eos`
- __`Object`__ - __`block`__: valid block

### Returns

- __`Promise`__ : when resolved returs a string that specify if the submission succedeed

### Example
```js
> const block = {
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
> ptokens.enclave.submitBlock('eth', block).then(res => console.log(res))
> Eth block submitted to the enclave!
```

&nbsp;