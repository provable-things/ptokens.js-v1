# ptokens-perc20

This module enables the interaction with pERC20 tokens.

&nbsp;

### Installation

```
npm install ptokens-perc20
```

&nbsp;

***

&nbsp;

## Usage


### Peg-in


```js
import { pERC20 } from 'ptokens-perc20'
import { HttpProvider } from 'ptokens-providers' 
import { Node } from 'ptokens-node'

const pweth = new pERC20({
  blockchain: 'EOS',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  pToken: 'pWETH',
  // if you want to send ether instead of weth, you can use 'pETH'

  // if you want to be more detailed
  hostBlockchain: 'EOS',
  hostNetwork: 'mainnet',
  nativeBlockchain: 'ETH'
  nativeNetwork: 'mainnet'

  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...' // or also an instance of JsonRpc
  eosSignatureProvider: '....', // instance of JsSignatureProvider
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

pweth.issue('amount in wei', 'eos address', { gas: 20000, gasPrice: 75e9 })
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
import { pERC20 } from 'ptokens-pweth'

const pweth = new pERC20({
  blockchain: 'EOS',
  network: 'testnet', // 'testnet' or 'mainnet', default 'testnet'

  pToken: 'pWETH',
  // if you want to send ether instead of weth, you can use 'pETH'

  // if you want to be more detailed
  hostBlockchain: 'EOS',
  hostNetwork: 'mainnet',
  nativeBlockchain: 'ETH'
  nativeNetwork: 'mainnet'

  ethPrivateKey: 'Eth private key',
  ethProvider: 'Eth provider', // or instance of Web3 provider
  eosPrivateKey: 'Eos Private Key',
  eosRpc: 'https:/...' // or also an instance of JsonRpc
  eosSignatureProvider: '....' // instance of JsSignatureProvider
})

pweth.redeem(amount, nativeAddress)
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
import { pERC20 } from 'ptokens-pweth'

if (window.web3) {
  
  const pweth = new pERC20({
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

* __`issue`__
* __`redeem`__

***

## issue

```js
pweth.issue(amout, address)
```
Issue the specified amount on the pToken specified in the constructor to the selected address on the host blockchain

### Parameters
- __`String`__ - __`address`__: Ethereum address
- __`String`__ - __`amout`__: Amount in wei

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Node redeemd the specified amount of pERC20 issued.

### Example
```js
pweth.issue('10000000000000', address)
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
pweth.redeem(amount, nativeAddress)
```

Redeem the specified number of pERC20 to the specified address.

### Parameters

- __`Number`__ - __`amount`__: amount of pERC20 to redeem
- __`String`__ - __`nativeAddress`__: address where to receive the redeemed pTokens
- __`Object`__ - __`options`__: redeem option (optional)
    - __`Number|String|BigNumber`__ - __`gasPrice`__: The price of gas for this transaction in wei
    - __`Number`__ - __`gas`__:  The amount of gas to use for the transaction (unused gas is refunded)

### Returns

- __`Promievent`__ : A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.0/callbacks-promises-events.html#promievent). Will be resolved when the Node redeemd the specified amount of pERC20 redeemed.

### Example
```js
pweth.redeem(1, 'ltc address')
  .once('hostTxConfirmed', tx =>. ...)
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('nativeTxConfirmed', tx => ...)
  .then(res => ...)
```
