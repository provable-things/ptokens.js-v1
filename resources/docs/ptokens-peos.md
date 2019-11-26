# ptokens-peos

This module allows to interact with pEOS token.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-peos
```


### Usage without an already initialized Web3 and eosjs instance

```js
const peos = require('ptokens-peos')

const configs = {
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'EOS private key',
  eosProvider: 'EOS provider'
}
const peos = new pPEOS(configs)
```


### Usage with an already initialized Web3 instance
```js
const peos = require('ptokens-peos')

if (window.web3) {
  const web3 = new Web3(window.web3.currentProvider)
  const configs = {
    eosPrivateKey: 'EOS private key',
    eosProvider: 'EOS provider'
    web3
  }
  
  const peos = new pPEOS(configs)
} else {
  console.log('No web3 detected')
}
```


### Usage with an already initialized eosjs instance

```js
const peos = require('ptokens-peos')

const eosjs = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(), 
  textEncoder: new TextEncoder() 
})

const web3 = new Web3(window.web3.currentProvider)
const configs = {
  eosjs
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
}
  
const peos = new pPEOS(configs)
```


### Usage with Web3 and eosjs instances already initialized

```js
const peos = require('ptokens-peos')

if (window.web3) {
  
  const eosjs = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(), 
    textEncoder: new TextEncoder() 
  })

  const web3 = new Web3(window.web3.currentProvider)
  const configs = {
    eosjs
    web3
  }
  
  const peos = new pPEOS(configs)
} else {
  console.log('No web3 detected')
}
```

***

## Class Methods

* __`approve`__
* __`getBalance`__
* __`getAllowance`__
* __`getBurnNonce`__
* __`getCirculatingSupply`__
* __`getCollateral`__
* __`getMintNonce`__
* __`getTotalIssued`__
* __`getTotalRedeemed`__
* __`issue`__
* __`redeem`__
* __`transfer`__
* __`transferFrom`__

***

## approve

```js
ptokens.peos.approve(spender, amount)
```

### Parameters

- __`String`__ - __`spender`__: Ethereum account
- __`Number`__ - __`amount`__: amount to transfer

Approve to spend the specified amount of pEOS to the provided Ethereum account by setting the allowance of spender account

### Returns

- __`Boolean`__ : boolean value indicating whether the approve operation succeeded

### Example
```js
ptokens.peos.approve('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;

## getBalance

```js
ptokens.peos.getBalance(account)
```

### Parameters

- __`String`__ - __`account`__: Ethereum account

Get the current pEOS balance of the provided account


### Returns

- __`Number`__ : current balance of the provided Ethereum account

### Example
```js
ptokens.peos.getBalance(account).then(balance => console.log(balance))
```

&nbsp;


## getAllowance

```js
ptokens.peos.getAllowance(owner, spender)
```

### Parameters

- __`String`__ - __`owner`__: Owner Ethereum account
- __`String`__ - __`spender`__: Spender Ethereum account

Get the remaining number of pEOS that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Returns

- __`Number`__ : number of pEOS that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Example
```js
ptokens.peos.getAllowance('owner eth address', 'spender eth address').then(allowance => console.log(status))
```

&nbsp;

## getBurnNonce

```js
ptokens.peos.getBurnNonce()
```

### Parameters

Get the total number of Burn events


### Returns

- __`Number`__ : current number of burning events

### Example
```js
ptokens.peos.getBurnNonce().then(burnNonce => console.log(burnNonce))
```

&nbsp;

## getCirculatingSupply

```js
ptokens.peos.getCirculatingSupply()
```

Get the current pEOS circulating supply


### Returns

- __`Number`__ : current pEOS circulating supply 

### Example
```js
ptokens.peos.getCirculatingSupply().then(circulatingSupply => console.log(circulatingSupply))
```

&nbsp;

## getCollateral

```js
ptokens.peos.getCollateral()
```

Get the current deposited EOS as collateral


### Returns

- __`Number`__ : current collateral

### Example
```js
ptokens.peos.getCollateral().then(collateral => console.log(collateral))
```

&nbsp;


## getMintNonce

```js
ptokens.peos.getMintNonce()
```

### Parameters

Get the total number of Mint events


### Returns

- __`Number`__ : current number of minting events

### Example
```js
ptokens.peos.getMintNonce().then(mintNonce => console.log(mintNonce))
```

&nbsp;

## getTotalIssued

```js
ptokens.peos.getTotalIssued()
```

Get the total number of total issued pEOS.


### Returns

- __`Number`__ : total number of issued pEOS

### Example
```js
ptokens.peos.getTotalIssued().then(totalIssued => console.log(totalIssued))
```

&nbsp;

## getTotalRedeemed

```js
ptokens.peos.getTotalRedeemed()
```

Get the total number of total redeemed pEOS.


### Returns

- __`Number`__ : total number of redeemed pEOS

### Example
```js
ptokens.peos.getTotalRedeemed().then(totalRedeemed => console.log(totalRedeemed))
```

&nbsp;


## issue

```js
ptokens.peos.issue(_amount, _ethAddress)
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
ptokens.peos.redeem(_amount, _eosAccount)
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

## transfer

```js
ptokens.peos.transfer(to, amount)
```

### Parameters

- __`String`__ - __`to`__: Ethereum account
- __`Number`__ - __`amount`__: amount to transfer

Transfer a specified amount of pEOS to the provided Ethereum account

### Returns

- __`Boolean`__ : boolean value indicating whether transfer operation succeeded

### Example
```js
ptokens.peos.transfer('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;


## transferFrom

```js
ptokens.peos.transferFrom(from, to, amount)
```

### Parameters

- __`String`__ - __`from`__: Ethereum account
- __`Number`__ - __`amount`__: amount to transfer

Move the specified amount of pEOS from `from` to `to` using the allowance mechanism

### Returns

- __`Boolean`__ : boolean value indicating whether transferFrom operation succeeded

### Example
```js
ptokens.peos.transfer('eth address', 1.3452).then(status => console.log(status))
```