# ptokens-deposit-address

### Usage

```js
import { DepositAddress } from 'ptokens-deposit-address'
import { Node } from 'ptokens-node'

const depositAddress = new DepositAddress({
  blockchain: 'ETH', //or EOS
  network: 'testnet', //'testnet' or 'mainnet', default 'testnet'

  //if you want to be more detailed
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'LTC'
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
depositAddress.generate(address)
```

Generate a new deposit address

### Parameters

- __`String`__ - __`address`__: Ethereum address

### Returns

- __`Promise`__ : when resolved returns a deposit address

### Example
```js
depositAddress.generate('address').then(addr => console.log(addr))
```

***

## toString


```js
depositAddress.toString()
```

Returns an address in the form of a string.


### Returns

- __`String`__ : deposit address

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

Monitors the minting process

### Returns

- __`PromiEvent`__ :  Will be resolved when the Node issues the corresponsing transaction

### Example
```js
depositAddress.waitForDeposit(
  .once('nativeTxBroadcasted', tx => ...) 
  .once('nativeTxConfirmed', tx => ...) 
  .once('nodeReceivedTx', report => ...)
  .once('nodeBroadcastedTx', report => ...)
  .once('hostTxConfirmed', tx => ...)
  .then(res => res => ...)
```