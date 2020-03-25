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
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  //optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...'
  eosSignatureProvider: ..
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
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  //optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...'
  eosSignatureProvider: ..
})

pbtc.redeem(amount, btcAddress)
  .once('onEthTxConfirmed', tx => ...) //in case of eos, onEosTxConfirmed
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onBtcTxConfirmed', tx => ...)
  .then(res => ...)
```

&nbsp;

It is possible to pass a standard Ethereum Provider as the __`ethProvider`__ value, such as the one injected 
into the content script of each web page by Metamask(__`window.web3.currentProvider`__).
Instead in case the __`hostBlockchain`__ field is equal to __`EOS`__.
It is possible to pass a standard __`JsSignatureProvider`__ as __`eosSignatureProvider`__ and
__`eosRpc`__  can be a __`JsonRpc`__ or a string containing an rpc endpoint.

```js
import { pBTC } from 'ptokens-pbtc'

if (window.web3) {
  
  const pbtc = new pBTC({
    blockchain: 'ETH'
    ethProvider: window.web3.currentProvider,
    network: 'testnet'
  })
} else {
  console.log('No web3 detected')
}
```
&nbsp;

***

&nbsp;

## Class Methods

* __`getDepositAddress`__
* __`redeem`__

***

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
  .once('onEthTxConfirmed', tx => ...) //or onEosTxConfirmed
  .then(res => ...))
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
  .once('onEthTxConfirmed', tx =>. ...) //or onEosTxConfirmed
  .once('onNodeReceivedTx', report => ...)
  .once('onNodeBroadcastedTx', report => ...)
  .once('onBtcTxConfirmed', tx => ...)
  .then(res => ...)
```

&nbsp;

***

&nbsp;

# BtcDepositAddress

### Usage

```js
import { BtcDepositAddress } from 'ptokens-pbtc'

const depositAddress = new BtcDepositAddress({
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC'
  nativeNetwork: 'testnet'

  hostApi: new Web3() // new Api
  node: new Node({...})
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
depositAddress.generate('eth address or eos account').then(addr => console.log(addr))
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
  .once('onEthTxConfirmed', tx => ...) //or onEosTxConfirmed
  .then(res => res => ...)
```