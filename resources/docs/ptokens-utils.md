# ptokens-utils

This module enables access to some useful utilities used by other packages.

&nbsp;

### Installation

```
npm install ptokens-utils
```

&nbsp;

***

&nbsp;

## utils.btc

## btc.broadcastTransaction

```js
utils.btc.broadcastTransaction(network, transaction)
```

Broadcasts a Bitcoin transaction using Blockstream Esplora API

### Parameters

- __`String`__ - __`address`__: can be __bitcoin__ or __testnet__
- __`String`__ - __`transaction`__: transaction in Hex format

### Returns

- __`Promise`__ : when resolved returns if the transaction has been broadcasted succesfully

### Example
```js
const isBroadcasted = await utils.btc.broadcastTransaction('testnet', 'tx hex')
```

&nbsp;

## btc.getUtxoByAddress

```js
utils.btc.getUtxoByAddress(network, address)
```

Returns all UTXOs belonging to a Bitcoin address 

### Parameters

- __`String`__ - __`network`__: can be __bitcoin__ or __testnet__
- __`String`__ - __`address`__: Bitcoin address

### Returns

- __`Promise`__ : when resolved returns all UTXOs belonging to a Bitcoin address 

### Example
```js
const utxos = await utils.btc.getUtxoByAddress('testnet', 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP')
```

&nbsp;

## btc.getTransactionHexById

```js
utils.btc.getTransactionHexById(network, transactionId)
```

Returns a transaction in hex format

### Parameters

- __`String`__ - __`address`__: can be __bitcoin__ or __testnet__
- __`String`__ - __`transactionId`__: Bitcoin transaction id

### Returns

- __`Promise`__ : when resolved returns a transaction in hex format 

### Example
```js
const txHex = await utils.btc.getTransactionHexById('testnet', '3eccff684a63d7643a93936e703c28ab0cd7677093fcf008e194f33ae0393cd3')
```

&nbsp;

## btc.isValidAddress

```js
utils.btc.isValidAddress(address)
```

Returns a boolean indicating the address validity

### Parameters

- __`String`__ - __`address`__: address

### Returns

- __`Boolean`__ : the address validity

### Example
```js
utils.btc.isValidAddress('mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP') //true
```

&nbsp;

## btc.monitorUtxoByAddress

```js
utils.btc.monitorUtxoByAddress(network, address, eventEmitter, pollingTime)
```

Allows to monitor if an address is receving a transaction

### Parameters

- __`String`__ - __`network`__: can be __bitcoin__ or __testnet__
- __`String`__ - __`address`__: Bitcoin address
- __`EventEmitter`__ - __`eventEmitter`__: event emitter used to emit __onBtcTxBroadcasted__ and __onBtcTxConfirmed__ events
- __`Number`__ - __`pollingTime`__: time interval to call BlockStream Esplora API

### Returns

- __`Promise`__ : when resolved returns the utxo just confirmed

### Example
```js
const eventEmitter = new EventEmitter()

eventEmitter.once('onBtcTxBroadcasted', tx => ...)
eventEmitter.once('onBtcTxConfirmed', tx => ...)
const utxo = await utils.btc.monitorUtxoByAddress('testnet', 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP', eventEmitter, 2000)
```

&nbsp;

## btc.waitForTransactionConfirmation

```js
utils.btc.waitForTransactionConfirmation(network, transaction, pollingTime)
```

Allow to wait for a BTC transaction confirmation

### Parameters

- __`String`__ - __`network`__: can be __bitcoin__ or __testnet__
- __`String`__ - __`transaction`__: Bitcoin address
- __`Number`__ - __`pollingTime`__: time interval to call BlockStream Esplora API

### Returns

- __`Promise`__ : when resolved returns the confirmed transaction

### Example
```js
const tx = await utils.btc.waitForTransactionConfirmation('testnet', '3eccff684a63d7643a93936e703c28ab0cd7677093fcf008e194f33ae0393cd3', 2000)
```

&nbsp;

***

## utils.converters

* __`decodeUint64le`__

***

## converters.decodeUint64le

```js
utils.converters.decodeUint64le(buffer)
```

Returns an Unsigned 64 bit Integer from a Buffer representing an Unsigned 64 bit Integer in Little Endian format

### Parameters

- __`Buffer`__ - __`buffer`__: Buffer representing an Unsigned 64 bit Integer in Little Endian format

### Returns

- __`Integer`__ : an Unsigned 64 bit Integer

### Example
```js
utils.converters.decodeUint64le(new Buffer('0x456'))
```

&nbsp;

## converters.encodeUint64le

```js
utils.converters.encodeUint64le(value)
```

Returns an Unsigned 64 bit Integer decoded in Little Endian format represented by a Buffer

### Parameters

- __`Number`__ - __`value`__: encoded Unsigned 64 bit Integer in Little Endian format

### Returns

- __`Buffer`__ : an Unsigned 64 bit Integer decoded in Little Endian format represented by a Buffer

### Example
```js
utils.converters.encodeUint64le(0x05)
```

&nbsp;

***

# utils.helpers

* __`getNetworkType`__
* __`getBlockchainType`__
* __`getBlockchainShortType`__
* __`getNativeBlockchainFromPtokenName`__
* __`isValidPTokenName`__
* __`parseParams`__

***


## helpers.getNetworkType

```js
utils.helpers.getNetworkType(network)
```

Returns a string (__mainnet__ or __testnet__) inditicating the network type
of a given network label (ex: __testnet_ropsten__)

### Parameters

- __`String`__ - __`network`__: network label

### Returns

- __`String`__ : network type

### Example
```js
utils.helpers.getNetworkType('testnet_ropsten') //testnet
```

&nbsp;

## helpers.getBlockchainType

```js
utils.helpers.getBlockchainType(blockchain)
```

Normalizes acronyms of blockchain names in order to keep consistency among them. 
(ex: __'eth'__ is trasnformed into __ethereum__)

### Parameters

- __`String`__ - __`blockchain`__: blockchain name

### Returns

- __`String`__ : blockchain normalized name

### Example
```js
utils.helpers.getBlockchainType('eth') //ethereum
utils.helpers.getBlockchainType('ethereum') //ethereum
utils.helpers.getBlockchainType('btc') //bitcoin
```

&nbsp;

***

## helpers.getBlockchainShortType

```js
utils.helpers.getBlockchainShortType(blockchain)
```

Returns blockchain name composed of 3 character (ex. __ethereum__ is transformed into __eth__).

### Parameters

- __`String`__ - __`blockchain`__: blockchain name

### Returns

- __`String`__ : blockchain short name

### Example
```js
utils.helpers.getBlockchainShortType('eth') //eth
utils.helpers.getBlockchainShortType('ethereum') //eth
utils.helpers.getBlockchainShortType('bitcoin') //btc
```

&nbsp;

## helpers.getNativeBlockchainFromPtokenName

```js
utils.helpers.getNativeBlockchainFromPtokenName(name)
```

Returns the (full) native blockchain name give a pToken name.

### Parameters

- __`String`__ - __`name`__: pToken name

### Returns

- __`String`__ : blockchain shor name

### Example
```js
utils.helpers.getNativeBlockchainFromPtokenName('pBTC') //bitcoin
```

&nbsp;

## helpers.isValidPTokenName

```js
utils.helpers.isValidPTokenName(name)
```

Checks if a given string is a valid pToken name.

### Parameters

- __`String`__ - __`name`__: pToken name

### Returns

- __`Boolean`__ : pToken name validity

### Example
```js
utils.helpers.isValidPTokenName('pBTC') //true
utils.helpers.isValidPTokenName('pbtc') //true
utils.helpers.isValidPTokenName('pbtc2') //false
```

&nbsp;

## helpers.parseParams

```js
utils.helpers.parseParams(params, nativeBlockchain = null)
```

Function used to return a consistent object (object containing __hostBlockchain__, __hostNetwork__, 
__nativeBlockchain__ and __nativeNetwork__) from the initialization params.

### Parameters

- __`String`__ - __`name`__: pToken name

### Returns

- __`Boolean`__ : pToken name validity

### Example
```js
utils.helpers.parseParams({
  network: 'testnet',
  blockchain: 'eth'
}, 'bitcoin')

/*{ 
  hostBlockchain: 'ethereum',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'bitcoin',
  nativeNetwork: 'testnet'
}*/
}

```

&nbsp;

## utils.eth

* __`addHexPrefix`__
* __`correctFormat`__
* __`getAccount`__
* __`getContract`__
* __`getGasLimit`__
* __`isHexPrefixed`__
* __`makeContractCall`__
* __`makeContractSend`__
* __`makeTransaction`__
* __`sendSignedMethodTx`__

***


## eth.addHexPrefix

```js
utils.eth.addHexPrefix(text)
```

Returns a string always `0x` prefixed

### Parameters

- __`String`__ - __`text`__: text

### Returns

- __`String`__ : a string `0x` prefixed 

### Example
```js
const res = utils.eth.addHexPrefix('hello') //0xhello
```

&nbsp;

## eth.correctFormat

```js
utils.eth.addHexPrefix(amount, decimals, operation)
```

Returns a number equal to the `amount` divied/multiplied (`operation`) by `decimals` (useful for erc20 tokens).

### Parameters

- __`Number`__ - __`amount`__: on chain amount
- __`String`__ - __`decimals`__: number of decimals
- __`Character`__ - __`operation`__: `*` or `/`

### Returns

- __`Number`__ : a number formatted correctly

### Example
```js
const res = utils.eth.correctFormat(1000, 4, '/') //0.1
```

&nbsp;

## eth.getAccount

```js
utils.eth.getAccount(web3)
```

Returns the current Ethereum address given an instance of Web3 and specifying if it's injected (i.e.: a Web3 instance injected by Metamask)

### Parameters

- __`Object`__ - __`Web3`__: Web3 instance


### Returns

- __`Promise`__ : when resolved it returns the current Ethereum address

### Example
```js
const account = await utils.eth.getAccount(web3)
```

&nbsp;

## eth.getContract

```js
utils.eth.getContract(web3, abi, contractAddress, account)
```

Returns a [Web3.eth.Contract](https://web3js.readthedocs.io/en/v1.2.0/Web3-eth-contract.html) instance given a Web3 one, the contract abi, its address (`contractAddress`) and the address (`account`) where transactions should be made from

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`Boolean`__ - __`abi`__: json interface of the contract to instantiate
- __`String`__ - __`contractAddress`__: Smart Contract address
- __`String`__ - __`account`__: the address where transactions should be made from.
### Returns

- __`Object`__ : `Web3.eth.Contract` instance

### Example
```js
const contract = utils.eth.getContract(web3, true)
```

&nbsp;

## eth.getGasLimit

```js
utils.eth.getGasLimit(web3)
```

Returns the gas limit of the latest Ethereum block.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance

### Returns

- __`Promise`__ : when resolved returns the current gas limit

### Example
```js
const gasLimit = await utils.eth.getGasLimit(web3)
```

&nbsp;

## eth.isHexPrefixed

```js
utils.eth.isHexPrefixed(text)
```

Check if a given string (`text`) is `0x` prefixed

### Parameters

- __`String`__ - __`text`__: text

### Returns

- __`Boolean`__ : true if the input has a `0x` prefix

### Example
```js
const isHexPrefixed = await utils.eth.isHexPrefixed('0xhello') //true
```

&nbsp;

## eth.makeContractCall

```js
utils.eth.makeContractCall(web3, method, options, params = [])
```

Performs a contract `call` given a Web3 instance and the Smart Contract details.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`String`__ - __`method`__: Smart Contract method to call
- __`Object`__ - __`options`__
    - __`Object`__ - __`abi`__: Smart Contract json interface
    - __`String`__ - __`contractAddress`__: Smart Contract address
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved it returns the value returned by the Smart Contract

### Example
```js
const options = {
  abi,
  contractAddess: 'eth contract address',
}
const value = await utils.eth.makeContractCall(web3, 'balanceOf', { abi, contractAddress: '' } , ['eth address']) //true
```

&nbsp;

## eth.sendSignedMethodTx

```js
utils.eth.sendSignedMethodTx(web3, method, options, params = [])
```

Performs a contract `send` given a Web3 instance and the Smart Contract details.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`String`__ - __`method`__: Smart Contract method to call
- __`Object`__ - __`options`__
    - __`Object`__ - __`abi`__: Smart Contract json interface
    - __`String`__ - __`contractAddress`__: Smart Contract address
    - __`Object`__ - __`privateKey`__: current Account private key (use when `isWeb3Injected = false` otherwise `null`)
    - __`String`__ - __`value`__: value to send to the Smart Contract
    - __`Number|BigNumber|String`__ - __`gas`__: Ethereum transaction Gas limit
    - __`Number|BigNumber|String`__ - __`gasLimit`__: Ethereum transaction Gas price
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved it returns the receipt of the transaction performed

### Example
```js
const receipt = await utils.eth.sendSignedMethodTx(
  web3,
  'transfer',
  { abi, contractAddress: 'eth contract address', privateKey: 'provate key', value: 0, gas, gasPrice }, 
  ['eth address']
)
```

&nbsp;

## eth.makeContractSend

```js
utils.eth.makeContractSend(web3, method, options, params = [])
```

Performs a contract `send` given a Web3 instance and the Smart Contract details.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`String`__ - __`method`__: Smart Contract method to call
- __`Object`__ - __`options`__
    - __`Object`__ - __`abi`__: Smart Contract json interface
    - __`String`__ - __`contractAddress`__: Smart Contract address
    - __`String`__ - __`value`__: value to send to the Smart Contract
    - __`Number|BigNumber|String`__ - __`gas`__: Ethereum transaction Gas limit
    - __`Number|BigNumber|String`__ - __`gasLimit`__: Ethereum transaction Gas price
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved it returns the receipt of the transaction performed

### Example
```js
const receipt = await utils.eth.makeContractSend(
  web3,
  'transfer',
  { abi, contractAddress: 'eth contract address', value: 0, gas, gasPrice }, 
  ['eth address']
)
```

&nbsp;

## eth.waitForTransactionConfirmation

```js
utils.eth.waitForTransactionConfirmation(web3, transaction, pollingTime)
```

Allow to wait for a ETH transaction confirmation

### Parameters

- __`Object`__ - __`web3`__: an initialized instance of __Web3__
- __`String`__ - __`transaction`__: Ethereum transaction hash
- __`Number`__ - __`pollingTime`__: time interval to call __web3.eth.getTransactionReceipt__

### Returns

- __`Promise`__ : when resolved returns the confirmed transaction

### Example
```js
const tx = await utils.eth.waitForTransactionConfirmation(web3, '0x8cc2e8f07ac6ae2fab2fbcdb6f8b985383eec42f9ecb589377bdbe60d85bcae1', 2000)
```

&nbsp;

***


## utils.eos

* __`getApi`__
* __`getAmountInEosFormat`__
* __`isValidAccountName`__
* __`waitForTransactionConfirmation`__

***

## eos.getApi

```js
utils.eos.getApi(privateKey, rpc, eosSignatureProvider)
```

Returns an initialized EOS __`Api`__ object

### Parameters

- __`String`__ - __`privateKey`__: an EOS private key
- __`String`__ - __`rpc`__: an EOS node rpc address
- __`JsSignatureProvider`__ - __`eosSignatureProvider`__: an already initialized JsSignatureProvider

### Returns

- __`Api`__ : Returns an initialized EOS __`Api`__ object

### Example
```js
const api = utils.eos.getApi('provate key', 'https://', null)
```

&nbsp;

## eos.getAmountInEosFormat

```js
utils.eos.getAmountInEosFormat(amount, decimals, symbol)
```

Returns an amount value formatted for using __`.transact`__ function

### Parameters

- __`Number`__ - __`amount`__:  amount
- __`Number`__ - __`decimals`__:  number of decimales
- __`String`__ - __`symbol`__:  token symbol

### Returns

- __`String`__ : string formatted for using __`.transact`__ function

### Example
```js
const amount = utils.eos.getAmountInEosFormat(0.23, 8, 'PBTC') //0.23000000 PBTC
```

&nbsp;

## eos.isValidAccountName

```js
utils.eos.isValidAccountName(accountName)
```

Returns a boolean indicating an account name correctness

### Parameters

- __`String`__ - __`accountName`__:  EOS account name

### Returns

- __`Boolean`__ : a boolean indicating an account name correctness

### Example
```js
const isValid = utils.eos.isValidAccountName('allemanfredi') //true
const isValid = utils.eos.isValidAccountName('alleman33fredi') //false
```

&nbsp;

## eos.waitForTransactionConfirmation

```js
utils.eos.waitForTransactionConfirmation(api, transactionId)
```

Returns a boolean indicating the status of a transaction (true = confirmed, false = not confirmed).

### Parameters

- __`Api`__ - __`api`__:  an EOS Api instance
- __`String`__ - __`transactionId`__:  an EOS transaction id

### Returns

- __`Boolean`__ : a boolean indicating the status of a transaction

### Example
```js
const isValid = utils.eos.waitForTransactionConfirmation(api, 'tx id') //true
```

&nbsp;