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
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

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
    //optionals
  defaultNode: new Node({
    pToken: 'pBTC',
    blockchain: 'ETH',
    provider: new HttpProvider(
      'node endpoint',
      {
        'Access-Control-Allow-Origin': '*',
        ...
      }
    )
  })
})

const depositAddress = await pbtc.getDepositAddress('eth/eos address')
console.log(depositAddress.toString())

//fund the BTC address just generated (not ptokens.js stuff)

depositAddress.waitForDeposit()
  .once('nativeTxBroadcasted', tx => ... )
  .once('nativeTxConfirmed', tx => ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('hostTxConfirmed', tx => ...)
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
  .once('hostTxConfirmed', tx => ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('nativeTxConfirmed', tx => ...)
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

- __`DepositAddress`__ : a deposit Address

### Example
```js
const depositAddress= await ptokens.pbtc.getDepositAddress(ethAddress)

console.log(depositAddress.toString())

depositAddress.waitForDeposit()
  .once('nativeTxBroadcasted', tx => ... )
  .once('nativeTxConfirmed', tx => ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('hostTxConfirmed', tx => ...)
  .then(res => ...))
```

&nbsp;

## redeem

```js
ptokens.pbtc.redeem(amount, btcAddress, options)
```

Redeem a specified number of pBTC to the specified BTC address.

### Parameters

- __`Number`__ - __`amount`__: amount of pBTC to redeem
- __`String`__ - __`btcAddress`__: BTC address where to receive the BTC redeemed
- __`Object`__ - __`options`__: redeem option (optional)
    - __`Number|String|BigNumber`__ - __`gasPrice`__: The price of gas for this transaction in wei
    - __`Number`__ - __`gas`__:  The amount of gas to use for the transaction (unused gas is refunded)

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Node redeemd the specified amount of pBTC redeemed.

### Example
```js
ptokens.pbtc.redeem(1, 'btc address')
  .once('hostTxConfirmed', tx =>. ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('nativeTxConfirmed', tx => ...)
  .then(res => ...)
```
