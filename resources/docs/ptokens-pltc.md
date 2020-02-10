# ptokens-ltc

This module allows to interact with pLTC token.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-pltc
```


### Usage

```js
const pLTC = require('ptokens-pltc')

const pltc = new pLTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  ltcNetwork: 'testnet' //'testnet' or 'litecoin', default 'testnet'
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
const pLTC = require('ptokens-pltc')

if (window.web3) {
  
  const pltc = new pLTC({
    ethProvider: window.web3.currentProvider,
    ltcNetwork: 'testnet'
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
ptokens.pltc.approve(spender, amount)
```

### Parameters

- __`String`__ - __`spender`__: spender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Approve to spend the specified amount of pLTC to the provided Ethereum address by setting the allowance of spender address

### Returns

- __`Boolean`__ : boolean value indicating whether the approve operation succeeded

### Example
```js
ptokens.pltc.approve('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;

## getAllowance

```js
ptokens.pltc.getAllowance(owner, spender)
```

### Parameters

- __`String`__ - __`owner`__: Owner Ethereum address
- __`String`__ - __`spender`__: Spender Ethereum address

Get the remaining number of pLTC that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Returns

- __`Number`__ : number of pLTC that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Example
```js
ptokens.pltc.getAllowance('owner eth address', 'spender eth address').then(allowance => console.log(status))
```

&nbsp;

## getBalance

```js
ptokens.pltc.getBalance(address)
```

### Parameters

- __`String`__ - __`address`__: Ethereum address

Get the current pLTC balance of the provided address


### Returns

- __`Number`__ : current balance of the provided Ethereum address

### Example
```js
ptokens.pltc.getBalance(address).then(balance => console.log(balance))
```

&nbsp;


## getBurnNonce

```js
ptokens.pltc.getBurnNonce()
```

### Parameters

Get the total number of Burn events


### Returns

- __`Number`__ : current number of burning events

### Example
```js
ptokens.pltc.getBurnNonce().then(burnNonce => console.log(burnNonce))
```

&nbsp;






## getDepositAddress

```js
ptokens.pltc.getDepositAddress(ethAddress)
```
Generate a LTC Deposit Address

### Parameters
- __`String`__ - __`ethAddress`__: Ethereum address


### Returns

- __`LtcDepositAddress`__ : a deposit Address

### Example
```js
const depositAddress= await ptokens.pltc.getDepositAddress(ethAddress)

console.log(depositAddress.toString())

depositAddress.waitForDeposit()
  .once('onLtcTxBroadcasted', tx => ... )
  .once('onLtcTxConfirmed', tx => ...)
  .once('onEnclaveReceivedTx', tx => ...)
  .once('onEnclaveBroadcastedTx', tx => ...)
  .once('onEthTxConfirmed', tx => ...)
  .then(res => ...))
```

&nbsp;

## getCirculatingSupply

```js
ptokens.pltc.getCirculatingSupply()
```

Get the current pLTC circulating supply


### Returns

- __`Number`__ : current pLTC circulating supply 

### Example
```js
ptokens.pltc.getCirculatingSupply().then(circulatingSupply => console.log(circulatingSupply))
```

&nbsp;


## getMintNonce

```js
ptokens.pltc.getMintNonce()
```

### Parameters

Get the total number of Mint events


### Returns

- __`Number`__ : current number of minting events

### Example
```js
ptokens.pltc.getMintNonce().then(mintNonce => console.log(mintNonce))
```

&nbsp;

## getTotalIssued

```js
ptokens.pltc.getTotalIssued()
```

Get the total number of total issued pLTC.


### Returns

- __`Number`__ : total number of issued pLTC

### Example
```js
ptokens.pltc.getTotalIssued().then(totalIssued => console.log(totalIssued))
```

&nbsp;

## getTotalRedeemed

```js
ptokens.pltc.getTotalRedeemed()
```

Get the total number of total redeemed pLTC.


### Returns

- __`Number`__ : total number of redeemed pLTC

### Example
```js
ptokens.pltc.getTotalRedeemed().then(totalRedeemed => console.log(totalRedeemed))
```

&nbsp;



## redeem

```js
ptokens.pltc.redeem(amount, eosAccount)
```

Redeem a specified number of pLTC to the specified LTC account.

### Parameters

- __`Number`__ - __`amount`__: amount of pLTC to redeem
- __`String`__ - __`ethAddress`__: LTC account on which receive back the deposited LTC

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Enclave redeemd the specified amount of pLTC

### Example
```js
ptokens.pltc.redeem(1, 'litecoin address')
  .once('onEthTxConfirmed', e => { console.log(e) })
  .once('onEnclaveReceivedTx', e => { console.log(e) })
  .once('onEnclaveBroadcastedTx', e => { console.log(e) })
  .once('onLtcTxConfirmed', e => { console.log(e) })
  .then(res => { console.log(res) })
```

&nbsp;

## transfer

```js
ptokens.pltc.transfer(to, amount)
```

### Parameters

- __`String`__ - __`to`__: receiver Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Transfer a specified amount of pLTC to the provided Ethereum address

### Returns

- __`Boolean`__ : boolean value indicating whether transfer operation succeeded

### Example
```js
ptokens.pltc.transfer('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;


## transferFrom

```js
ptokens.pltc.transferFrom(from, to, amount)
```

### Parameters

- __`String`__ - __`from`__: sender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Move the specified amount of pLTC from `from` to `to` using the allowance mechanism

### Returns

- __`Boolean`__ : boolean value indicating whether transferFrom operation succeeded

### Example
```js
ptokens.pltc.transfer('eth address', 1.3452).then(status => console.log(status))
```