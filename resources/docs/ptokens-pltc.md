# ptokens-pltc

This module enables the interaction with pLTC tokens.

&nbsp;

### Installation

```
npm install ptokens-pltc
```

&nbsp;

***

&nbsp;

## Usage


### Peg-in


```js
import { pLTC } from 'ptokens-pltc'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const pltc = new pLTC({
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'LTC'
  nativeNetwork: 'testnet'

  //optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...'
  eosSignatureProvider: ..,
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

const depositAddress = await pltc.getDepositAddress('eth/eos address')
console.log(depositAddress.toString())

//fund the LTC address just generated (not ptokens.js stuff)

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
import { pLTC } from 'ptokens-pltc'

const pltc = new pLTC({
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'LTC'
  nativeNetwork: 'testnet'

  //optionals
  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider',
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...'
  eosSignatureProvider: ..
})

pltc.redeem(amount, btcAddress)
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
import { pLTC } from 'ptokens-pltc'

if (window.web3) {
  
  const pltc = new pLTC({
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
ptokens.pltc.getDepositAddress(ethAddress)
```
Generate a LTC Deposit Address

### Parameters
- __`String`__ - __`ethAddress`__: Ethereum address


### Returns

- __`DepositAddress`__ : a deposit Address

### Example
```js
const depositAddress= await ptokens.pltc.getDepositAddress(ethAddress)

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
ptokens.pltc.redeem(amount, btcAddress)
```

Redeem a specified number of pLTC to the specified LTC address.

### Parameters

- __`Number`__ - __`amount`__: amount of pLTC to redeem
- __`String`__ - __`btcAddress`__: LTC address where to receive the LTC redeemed
- __`Object`__ - __`options`__: redeem option (optional)
    - __`Number|String|BigNumber`__ - __`gasPrice`__: The price of gas for this transaction in wei
    - __`Number`__ - __`gas`__:  The amount of gas to use for the transaction (unused gas is refunded)

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Node redeemd the specified amount of pLTC redeemed.

### Example
```js
ptokens.pltc.redeem(1, 'ltc address')
  .once('hostTxConfirmed', tx =>. ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('nativeTxConfirmed', tx => ...)
  .then(res => ...)
```
