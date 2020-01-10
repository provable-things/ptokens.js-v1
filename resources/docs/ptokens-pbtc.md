# ptokens-btc

This module allows to interact with pBTC token.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-pbtc
```


### Usage:

```js
const pBTC = require('ptokens-pbtc')

const pbtc = new pEOS({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' //'testnet' or 'bitcoin', default 'testnet'
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
const pBTC = require('ptokens-pbtc')

if (window.web3) {
  
  const pbtc = new pBTC({
    ethProvider: window.web3.currentProvider,
    btcNetwork: 'testnet'
  })
} else {
  console.log('No web3 detected')
}
```

***

## Class Methods

* __`approve`__
* __`getAllowance`__
* __`getBalance`__
* __`getBurnNonce`__
* __`getDepositAddress`__
* __`getCirculatingSupply`__
* __`getMintNonce`__
* __`getTotalIssued`__
* __`getTotalRedeemed`__
* __`redeem`__
* __`transfer`__
* __`transferFrom`__

***

## approve

```js
ptokens.peos.approve(spender, amount)
```

### Parameters

- __`String`__ - __`spender`__: spender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Approve to spend the specified amount of pEOS to the provided Ethereum address by setting the allowance of spender address

### Returns

- __`Boolean`__ : boolean value indicating whether the approve operation succeeded

### Example
```js
ptokens.peos.approve('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;

## getAllowance

```js
ptokens.peos.getAllowance(owner, spender)
```

### Parameters

- __`String`__ - __`owner`__: Owner Ethereum address
- __`String`__ - __`spender`__: Spender Ethereum address

Get the remaining number of pEOS that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Returns

- __`Number`__ : number of pEOS that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Example
```js
ptokens.peos.getAllowance('owner eth address', 'spender eth address').then(allowance => console.log(status))
```

&nbsp;

## getBalance

```js
ptokens.peos.getBalance(address)
```

### Parameters

- __`String`__ - __`address`__: Ethereum address

Get the current pEOS balance of the provided address


### Returns

- __`Number`__ : current balance of the provided Ethereum address

### Example
```js
ptokens.peos.getBalance(address).then(balance => console.log(balance))
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






## getDepositAddress

```js
ptokens.peos.getDepositAddress(ethAddress)
```
Generate a BTC Deposit Address

### Parameters
- __`String`__ - __`ethAddress`__: Ethereum address


### Returns

- __`DepositAddress`__ : a deposit Address

### Example
```js
ptokens.pbtc.getDepositAddress(ethAddress).then(depositAddress => {
  console.log(depositAddress.toString())

  console.log(depositAddress.verify()) //true if address has been generated succesfully

  depositAddress.waitForDeposit()
    .once('onBtcTxBroadcasted', tx => ... )
    .once('onBtcTxConfirmed', tx => ...)
    .once('onEnclaveReceivedTx', tx => ...)
    .once('onEnclaveBroadcastedTx', tx => ...)
    .once('onEthTxConfirmed', tx => ...)
    .then(res => ...))
})
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



## redeem

```js
ptokens.peos.redeem(amount, eosAccount)
```

Redeem a specified number of pEOS to the specified EOS account.

### Parameters

- __`Number`__ - __`amount`__: amount of pEOS to redeem
- __`String`__ - __`ethAddress`__: EOS account on which receive back the deposited EOS

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

- __`String`__ - __`to`__: receiver Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Transfer a specified amount of pEOS to the provided Ethereum address

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

- __`String`__ - __`from`__: sender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Move the specified amount of pEOS from `from` to `to` using the allowance mechanism

### Returns

- __`Boolean`__ : boolean value indicating whether transferFrom operation succeeded

### Example
```js
ptokens.peos.transfer('eth address', 1.3452).then(status => console.log(status))
```