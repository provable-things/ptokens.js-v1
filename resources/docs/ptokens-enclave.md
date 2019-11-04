# ptokens-enclave

This is the module that allows to interact with the Enclave.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-enclave
```

***

## Class Methods

* __`ping`__
* __`getEthReport`__
* __`getEosReport`__
* __`getLastProcessedEthBlock`__
* __`getLastProcessedEosBlock`__
* __`getIncomingTransactionStatus`__
* __`getBroadcastTransactionStatus`__
* __`submitEthBlock`__
* __`submitEosBlock`__

***


## ping

```js
ptokens.enclave.ping([_callback])
```

Check that the Enclave is running.

### Returns

- __`String`__ : 'Provable Pong'

### Example
```js
> ptokens.enclave.ping().then(res => console.log(res))
> Provable pong!
```

&nbsp;

## getEthReport

```js
ptokens.enclave.getEthReport(_limit, [_callback])
```

Gets a report of the transactions relating to the ETH signature nonce supplied.

### Parameters

- __`Number`__ - __`_limit`__: maximum number of Ethereum reports to be received

### Returns

- __`Object`__ : 

### Example
```js
> ptokens.enclave.getEthReport(1).then(res => console.log(res))
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

## getEosReport

```js
ptokens.enclave.getEosReport(_limit, [_callback])
```

Gets a report of the transactions relating to the ETH signature nonce supplied.

### Parameters

- __`Number`__ - __`_limit`__: maximum number of EOS reports to be received

### Returns

- __`Object`__ : report containing all informations

### Example
```js
> ptokens.enclave.getEosReport(1).then(res => console.log(res))
> [ 
    { 
      _id: 'EOS 677',
      eos_amount: null,
      broadcast: true,
      peos_sender: null,
      eos_recipient: null,
      eth_latest_nonce: null,
      broadcast_timestamp: 1572645663,
      eth_latest_block_num: null,
      eos_sender: 'provabletest',
      peos_amount: '21337',
      eos_signed_transactions: null,
      broadcast_transaction_hash:
      '0x6dff3a8c9cc225c83f20405c8df855b38297d5c6353299b67d7fb2e3efbf23b7',
      eos_latest_nonce: 677,
      eth_signed_transactions:
      { sender: 'provabletest',
        nonce: 677,
        amount: '21337',
        incomingTxId:
          'f4a30100c3312456546e4fc7a2c74887e38e88ce83fc09659168cf450a4e172f',
        recipient: '0x53C2048DAD4FCFAB44c3EF3d16e882B5178DF42b',
        ethAccountNonce: 436,
        transaction:
          '0xf8ac8201b48504a817c800830493e0944aeafc6f72ed16665a70a45297500a0bd9d8c2f080b84440c10f1900000000000000000000000053c2048dad4fcfab44c3ef3d16e882b5178df42b000000000000000000000000000000000000000000000000000000000000535978a04c3df4a34e1a69f12d2d73a4a53649db0b6b0d1526e1168b9bee382490d40d2aa047b3ba930eb7b25a2b6b121194607760e6fecd8612950fd9e7a80c7d19d0df12' },
      peos_recipient: '0x53C2048DAD4FCFAB44c3EF3d16e882B5178DF42b',
      eos_latest_block_num: 57874559,
      last_used_nonce_temp: 436,
      incoming_transaction_hash:
      'f4a30100c3312456546e4fc7a2c74887e38e88ce83fc09659168cf450a4e172f',
      witnessed_timestamp: 1572645662 
    } 
  ]
```

&nbsp;

## getLastProcessedEthBlock

```js
ptokens.enclave.getLastProcessedEthBlock([_callback])
```

Gets the last processed Ethereum block by the Enclave.


### Returns

- __`Object`__ : last processed Ethereum block by the Enclave

### Example
```js
> ptokens.enclave.getLastProcessedEthBlock().then(res => console.log(res))
> { 
    _id: 'last-seen-eth-block',
    latestBlockNum: 14585227 
  }
```

&nbsp;

## getLastProcessedEosBlock

```js
ptokens.enclave.getLastProcessedEosBlock([_callback])
```

Gets the last processed EOS block by the Enclave.

### Returns

- __`Object`__ : last processed EOS block by the Enclave

### Example
```js
> ptokens.enclave.getLastProcessedEosBlock().then(res => console.log(res))
> { 
    _id: 'last-seen-eos-block',
    latestBlockNum: 58319472 
  }
```

&nbsp;

## getIncomingTransactionStatus

```js
ptokens.enclave.getIncomingTransactionStatus(_hash, [callback])
```

Gets the status of an incoming transaction to the Enclave.

### Parameters

- __`String`__ - __`_hash`__: transaction hash

### Returns

- __`Object`__ : information about an incoming transaction to the Enclave

### Example
```js
> ptokens.enclave.getIncomingTransactionStatus('c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3').then(res => console.log(res))
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


## getBroadcastTransactionStatus

```js
ptokens.enclave.getBroadcastTransactionStatus(_hash, [callback])
```

Gets the status of a broadcasted transaction by the Enclave.

### Parameters

- __`String`__ - __`_hash`__: transaction hash

### Returns

- __`Object`__ : information about a broadcasted transaction by the Enclave

### Example
```js
> ptokens.enclave.getBroadcastTransactionStatus('0x80b97c8d9676915a0c51c66468eeb1745a6fdd70063f2fb0412fd1e01b7cd083').then(res => console.log(res))
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

## submitEthBlock

```js
ptokens.enclave.submitEthBlock(_block_, [callback])
```

Submit a valid Ethereum block to the Enclave.

### Parameters

- __`Object`__ - __`_block_`__: valid Ethereum block.

### Returns

- __`String`__ : 'Eth block submitted to the enclave!'

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
> ptokens.enclave.submitEthBlock(block).then(res => console.log(res))
> Eth block submitted to the enclave!
```

&nbsp;

## submitEosBlock

```js
ptokens.enclave.submitEosBlock(_block_, [callback])
```

Submit a valid EOS block to the Enclave.

### Parameters

- __`Object`__ - __`_block_`__: valid EOS block.

### Returns

- __`String`__ : 'Eos block submitted to the enclave!'

### Example
```js
> const block = {
    'timestamp': '2019-10-16T09:01:57.000',
    'producer': 'teamgreymass',
    'confirmed': 0,
    'previous': '0347c086212adacc319d08e4edf0abe6c8c3468ec5e79cb04de2984af59e3f14',
    'transaction_mroot': 'a8b28d4413ae22a8fbaf52fc2feee876009ca3fe3679c0ec23dbbd0a05cc8bd9',
    'action_mroot': '79e32e2b438849422cef5cc452c88970458419f30f679b0c7a414b1968c486f4',
    'schedule_version': 282,
    'new_producers': null,
    'header_extensions': [],
    'producer_signature': 'SIG_K1_KBxHqFmzpyeJzYyWZbUXXhVQPaQQwAEfudeuh6WmCcjhDyQMmdaGVbqc7qZBYeqm1UaBfP8ckFJqucdW939nqgh2NYFrwk',
    'transactions': [
      {
        'status': 'executed',
        'cpu_usage_us': 262,
        'net_usage_words': 27,
        'trx': {
          'id': 'c1e09684a51f756230f16aba30739a8e0744e2125ab3893669483ae65ea3ecd3',
          'signatures': [
            'SIG_K1_KhR7D8qXBzjNnsJQLe5ZY2MayhbKasiMTRjjk8VE58Bi7fzruSJ1UPcpTBxiW9nKHLJjfnyumzcVQ1GQKJzPUzrgoWF1GA'
          ],
          'compression': 'none',
          'packed_context_free_data': '',
          'context_free_data': [],
          'packed_trx': '9edca65d7dc05c26c554000000000100a6823403ea3055000000572d3ccdcd01e0d2b86b1a39623400000000a8ed32324be0d2b86b1a3962343021cd2a1eb3e9adcf5600000000000004454f53000000002a30783032366443364134333536314441384136413737353533386231393241336539333663304632394200',
          'transaction': {
            'expiration': '2019-10-16T09:02:22',
            'ref_block_num': 49277,
            'ref_block_prefix': 1422206556,
            'max_net_usage_words': 0,
            'max_cpu_usage_ms': 0,
            'delay_sec': 0,
            'context_free_actions': [],
            'actions': [
              {
                'account': 'eosio.token',
                'name': 'transfer',
                'authorization': [
                  {
                    'actor': 'all3manfr3di',
                    'permission': 'active'
                  }
                ],
                'data': {
                  'from': 'all3manfr3di',
                  'to': 'provabletokn',
                  'quantity': '2.2223 EOS',
                  'memo': '0x026dC6A43561DA8A6A775538b192A3e936c0F29B'
                },
                'hex_data': 'e0d2b86b1a3962343021cd2a1eb3e9adcf5600000000000004454f53000000002a307830323664433641343335363144413841364137373535333862313932413365393336633046323942'
              }
            ],
            'transaction_extensions': []
          }
        }
      }
    ],
    'block_extensions': [],
    'id': '0347c087fe5065dd83c567bd4b4170c76c2b8f56b0399cd3ef19920418c00b96',
    'block_num': 55033991,
    'ref_block_prefix': 3177694595
  }
> ptokens.enclave.submitEosBlock(block).then(res => console.log(res))
> Eos block submitted to the enclave!
```