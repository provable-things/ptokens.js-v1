# ptokens-pbtc

This module allows to interact with pBTC token.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-pbtc
```


### Usage

```js
import { pBTC } from 'ptokens-pbtc'

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' //'testnet' or 'bitcoin', default 'testnet'
})
```
It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).

```js
import { pBTC } from 'ptokens-pbtc'

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
ptokens.pbtc.approve(spender, amount)
```

### Parameters

- __`String`__ - __`spender`__: spender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Approve to spend the specified amount of pBTC to the provided Ethereum address by setting the allowance of spender address

### Returns

- __`Boolean`__ : boolean value indicating whether the approve operation succeeded

### Example
```js
ptokens.pbtc.approve('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;

## getAllowance

```js
ptokens.pbtc.getAllowance(owner, spender)
```

### Parameters

- __`String`__ - __`owner`__: Owner Ethereum address
- __`String`__ - __`spender`__: Spender Ethereum address

Get the remaining number of pBTC that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Returns

- __`Number`__ : number of pBTC that `spender` can spend spend on behalf of `owner` through `transferFrom`

### Example
```js
ptokens.pbtc.getAllowance('owner eth address', 'spender eth address').then(allowance => console.log(status))
```

&nbsp;

## getBalance

```js
ptokens.pbtc.getBalance(address)
```

### Parameters

- __`String`__ - __`address`__: Ethereum address

Get the current pBTC balance of the provided address


### Returns

- __`Number`__ : current balance of the provided Ethereum address

### Example
```js
ptokens.pbtc.getBalance(address).then(balance => console.log(balance))
```

&nbsp;


## getBurnNonce

```js
ptokens.pbtc.getBurnNonce()
```

### Parameters

Get the total number of Burn events


### Returns

- __`Number`__ : current number of burning events

### Example
```js
ptokens.pbtc.getBurnNonce().then(burnNonce => console.log(burnNonce))
```

&nbsp;


## getDepositAddress

```js
ptokens.pbtc.getDepositAddress(ethAddress)
```
Generate a BTC Deposit Address

### Parameters
- __`String`__ - __`ethAddress`__: Ethereum address


### Returns

- __`BtcDepositAddress`__ : a deposit Address

### Example
```js
const depositAddress= await ptokens.pbtc.getDepositAddress(ethAddress)

console.log(depositAddress.toString())

depositAddress.waitForDeposit()
  .once('onBtcTxBroadcasted', tx => ... )
  .once('onBtcTxConfirmed', tx => ...)
  .once('onEnclaveReceivedTx', tx => ...)
  .once('onEnclaveBroadcastedTx', tx => ...)
  .once('onEthTxConfirmed', tx => ...)
  .then(res => ...))
```

&nbsp;

## getCirculatingSupply

```js
ptokens.pbtc.getCirculatingSupply()
```

Get the current pBTC circulating supply


### Returns

- __`Number`__ : current pBTC circulating supply 

### Example
```js
ptokens.pbtc.getCirculatingSupply().then(circulatingSupply => console.log(circulatingSupply))
```

&nbsp;


## getMintNonce

```js
ptokens.pbtc.getMintNonce()
```

### Parameters

Get the total number of Mint events


### Returns

- __`Number`__ : current number of minting events

### Example
```js
ptokens.pbtc.getMintNonce().then(mintNonce => console.log(mintNonce))
```

&nbsp;

## getTotalIssued

```js
ptokens.pbtc.getTotalIssued()
```

Get the total number of total issued pBTC.


### Returns

- __`Number`__ : total number of issued pBTC

### Example
```js
ptokens.pbtc.getTotalIssued().then(totalIssued => console.log(totalIssued))
```

&nbsp;

## getTotalRedeemed

```js
ptokens.pbtc.getTotalRedeemed()
```

Get the total number of total redeemed pBTC.


### Returns

- __`Number`__ : total number of redeemed pBTC

### Example
```js
ptokens.pbtc.getTotalRedeemed().then(totalRedeemed => console.log(totalRedeemed))
```

&nbsp;



## redeem

```js
ptokens.pbtc.redeem(amount, btcAddress)
```

Redeem a specified number of pBTC to the specified BTC account.

### Parameters

- __`Number`__ - __`amount`__: amount of pBTC to redeem
- __`String`__ - __`btcAddress`__: BTC account on which receive back the deposited BTC

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Enclave redeemd the specified amount of pBTC

### Example
```js
ptokens.pbtc.redeem(1, 'btc address')
  .once('onEthTxConfirmed', e => { console.log(e) }) 
  .once('onEnclaveReceivedTx', e => { console.log(e) })
  .once('onEnclaveBroadcastedTx', e => { console.log(e) })
  .once('onLtcTxConfirmed', e => { console.log(e) })
  .then(res => { console.log(res) })
```

&nbsp;

## transfer

```js
ptokens.pbtc.transfer(to, amount)
```

### Parameters

- __`String`__ - __`to`__: receiver Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Transfer a specified amount of pBTC to the provided Ethereum address

### Returns

- __`Boolean`__ : boolean value indicating whether transfer operation succeeded

### Example
```js
ptokens.pbtc.transfer('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;


## transferFrom

```js
ptokens.pbtc.transferFrom(from, to, amount)
```

### Parameters

- __`String`__ - __`from`__: sender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

Move the specified amount of pBTC from `from` to `to` using the allowance mechanism

### Returns

- __`Boolean`__ : boolean value indicating whether transferFrom operation succeeded

### Example
```js
ptokens.pbtc.transfer('eth address', 1.3452).then(status => console.log(status))
```