# ptokens-pbtc

This module enables the interaction with pBTC tokens.

&nbsp;

### Installation

```
npm install ptokens-pbtc
```

&nbsp;

***

&nbsp;

## Usage


### Peg-in


```js
import { pBTC } from 'ptokens-pbtc'

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' //'testnet' or 'bitcoin', default 'testnet'
})

const depositAddress = await pbtc.getDepositAddress()

console.log(depositAddress.toString())

//fund the BTC address just generated (not ptokens.js stuff)

depositAddress.waitForDeposit()
  .once('onBtcTxBroadcasted', tx => ... )
  .once('onBtcTxConfirmed', tx => ...)
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onEthTxConfirmed', tx => ...)
  .then(res => ...))

```

&nbsp;

### Peg-out


```js
import { pBTC } from 'ptokens-pbtc'

const pbtc = new pBTC({
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  btcNetwork: 'testnet' //'testnet' or 'bitcoin', default 'testnet'
})

pbtc.redeem(amount, btcAddress)
  .once('onEthTxConfirmed', tx => ...) 
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onBtcTxConfirmed', tx => ...)
  .then(res => ...)
```

&nbsp;

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
&nbsp;

***

&nbsp;

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

Approves to send the specified amount of pBTC to the provided Ethereum address by setting the allowance of spender address

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

Get the remaining number of pBTC that `spender` can spend on behalf of `owner` through `transferFrom`

### Parameters

- __`String`__ - __`owner`__: Owner Ethereum address
- __`String`__ - __`spender`__: Spender Ethereum address

### Returns

- __`Number`__ : number of pBTC that `spender` can spend on behalf of `owner` through `transferFrom`

### Example
```js
ptokens.pbtc.getAllowance('owner eth address', 'spender eth address').then(allowance => console.log(status))
```

&nbsp;

## getBalance

```js
ptokens.pbtc.getBalance(address)
```
Get the current pBTC balance of the provided address


### Parameters

- __`String`__ - __`address`__: Ethereum address


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
Get the total number of Burn events


### Returns

- __`Number`__ : current number of burn events

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
  .once('onNodeReceivedTx', tx => ...)
  .once('onNodeBroadcastedTx', tx => ...)
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

Redeem a specified number of pBTC to the specified BTC address.

### Parameters

- __`Number`__ - __`amount`__: amount of pBTC to redeem
- __`String`__ - __`btcAddress`__: BTC address where to receive the BTC redeemed

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Node redeemd the specified amount of pBTC redeemed.

### Example
```js
ptokens.pbtc.redeem(1, 'btc address')
  .once('onEthTxConfirmed', tx =>. ...) 
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onBtcTxConfirmed', tx => ...)
  .then(res => ...)
```

&nbsp;

## transfer

```js
ptokens.pbtc.transfer(to, amount)
```

Transfer a specified amount of pBTC to the provided Ethereum address

### Parameters

- __`String`__ - __`to`__: receiver Ethereum address
- __`Number`__ - __`amount`__: amount to transfer


### Returns

- __`Boolean`__ : boolean value indicating whether the transfer operation succeeded

### Example
```js
ptokens.pbtc.transfer('eth address', 1.3452).then(status => console.log(status))
```

&nbsp;


## transferFrom

```js
ptokens.pbtc.transferFrom(from, to, amount)
```

Move the specified amount of pBTC from `from` to `to` using the allowance mechanism


### Parameters

- __`String`__ - __`from`__: sender Ethereum address
- __`Number`__ - __`amount`__: amount to transfer

### Returns

- __`Boolean`__ : boolean value indicating whether transferFrom operation succeeded

### Example
```js
ptokens.pbtc.transfer('eth address', 1.3452).then(status => console.log(status))
```


&nbsp;

***

&nbsp;

# BtcDepositAddress

### Usage

```js
import { BtcDepositAddress } from 'ptokens-pbtc'

const depositAddress = new BtcDepositAddress({
  web3: new Web3(...)
  node: new Node({...})
  network: 'testnet' //'testnet' or 'bitcoin', default 'testnet'
})
```

***

## Class Methods

* __`generate`__
* __`toString`__
* __`verify`__
* __`waitForDeposit`__

## generate

```js
depositAddress.generate(ethAddress)
```

Generate a new BTC deposit address

### Parameters

- __`String`__ - __`ethAddress`__: Ethereum address

### Returns

- __`Promise`__ : when resolved returns a BTC deposit address

### Example
```js
depositAddress.generate('eth address').then(addr => console.log(addr))
```

***

## toString


```js
depositAddress.toString()
```

Returns a BTC address in the form of a string.


### Returns

- __`String`__ : BTC deposit address

### Example
```js
console.log(depositAddress.toString())
```

## verify

```js
depositAddress.verify()
```

Checks that the deposit address matches with the expected address.

### Returns

- __`Boolean`__ : indicating if the address matches or not

### Example
```js
if (depositAddress.verify()) {
  console.log('valid')
}
```

## waitForDeposit

```js
depositAddress.waitForDeposit()
```

Monitors the pBTC minting process

### Returns

- __`PromiEvent`__ :  Will be resolved when the Node issues the corresponsing transaction

### Example
```js
depositAddress.waitForDeposit(
  .once('onBtcTxBroadcasted', tx => ...) 
  .once('onBtcTxConfirmed', tx => ...) 
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onEthTxConfirmed', tx => ...)
  .then(res => res => ...)
```