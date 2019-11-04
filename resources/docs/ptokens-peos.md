# ptokens-peos

This module allows to interact with pEOS token.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-peos
```

### Usage without injected web3

```js
const pEOS = require('ptokens-peos')

const configs = {
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
}
const peos = new pEOS(configs)
```

### Usage with injected web3

```js
const pEOS = require('ptokens-peos')

if (window.web3) {
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
  }
  const web3 = new Web3(window.web3.currentProvider)
  const peos = new pEOS(configs, web3)
} else {
  console.log('No web3 detected')
}
```

***

## Class Methods

* __`issue`__
* __`redeem`__
* __`getTotalIssued`__
* __`getTotalRedeemed`__
* __`getCirculatingSupply`__

***

## issue

```js
ptokens.peos.issue(_amount, _ethAddress, [_callback])
```

Issue a number of pEOS token to the specified Ethereum address.

### Parameters

- __`Number`__ - __`_amount`__: amount of pEOS to issue
- __`String`__ - __`_ethAddress`__: Ethereum address on which receive pEOS minted by the Enclave

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Enclave mints the specified amount of pEOS

### Example
```js
ptokens.peos.issue(1, 'eth address')
  .once('onEosTxConfirmed', e => { console.log(e) })  //eos tx receipt
  .once('onEnclaveReceivedTx', e => { console.log(e) }) //enclave.getIncomingTransactionStatus with response.broadcast = false
  .once('onEnclaveBroadcastedTx', e => { console.log(e) }) //enclave.getIncomingTransactionStatus with response.broadcast = true
  .once('onEthTxConfirmed', e => { console.log(e) }) //eth tx receipt
  .then(res => { console.log(res) })
```

&nbsp;

## redeem


```js
ptokens.peos.redeem(_amount, _eosAccount, [_callback])
```

Redeem a specified number of pEOS to the specified EOS account.

### Parameters

- __`Number`__ - __`_amount`__: amount of pEOS to redeem
- __`String`__ - __`_ethAddress`__: EOS account on which receive back the deposited EOS

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Enclave redeemd the specified amount of pEOS

### Example
```js
ptokens.peos.redeem(1, 'eos account')
  .once('onEthTxConfirmed', e => { console.log(e) })  //eth tx receipt
  .once('onEnclaveReceivedTx', e => { console.log(e) }) //enclave.getIncomingTransactionStatus with response.broadcast = false
  .once('onEnclaveBroadcastedTx', e => { console.log(e) }) //enclave.getIncomingTransactionStatus with response.broadcast = true
  .once('onEosTxConfirmed', e => { console.log(e) }) //eos tx receipt
  .then(res => { console.log(res) })
```

&nbsp;

## getTotalIssued

```js
ptokens.peos.getTotalIssued([_callback])
```

Get the total number of total issued pEOS.


### Returns

- __`Number`__ : total number of issued pEOS

### Example
```js
ptokens.peos.getTotalIssued().then(res => console.log(res))
```

&nbsp;

## getTotalRedeemed

```js
ptokens.peos.getTotalRedeemed([_callback])
```

Get the total number of total redeemed pEOS.


### Returns

- __`Number`__ : total number of redeemed pEOS

### Example
```js
ptokens.peos.getTotalRedeemed().then(res => console.log(res))
```

&nbsp;

## getCirculatingSupply

```js
ptokens.peos.getCirculatingSupply([_callback])
```

Get the current pEOS circulating supply


### Returns

- __`Number`__ : current pEOS circulating supply 

### Example
```js
ptokens.peos.getCirculatingSupply().then(res => console.log(res))
```
