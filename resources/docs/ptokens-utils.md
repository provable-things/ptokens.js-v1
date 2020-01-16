# ptokens-utils

This module allows to have access to some useful utilities used by other packages.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-utils
```

***

## utils.btc

* __`isValidAddress`__

***

## btc.isValidAddress

```js
ptokens.utils.btc.isValidAddress(address)
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

***

## utils.converters

* __`decodeUint64le`__

***

## converters.decodeUint64le

```js
ptokens.utils.converters.decodeUint64le(buffer)
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
ptokens.utils.converters.encodeUint64le(value)
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

* __`pTokenNameIsValid`__
* __`pTokenNameNormalized`__

***


## helpers.pTokenNameIsValid

```js
ptokens.utils.helpers.pTokenNameIsValid(pTokenName)
```

Returns a boolean indicating the pToken name correctness

### Parameters

- __`String`__ - __`pTokenName`__: pToken name

### Returns

- __`Boolean`__ : pToken name correctness

### Example
```js
utils.helpers.pTokenNameIsValid('peos') //true
utils.helpers.pTokenNameIsValid('pEOS') //true
utils.helpers.pTokenNameIsValid('pEdOS') //false
```

&nbsp;

## helpers.pTokenNameNormalized

```js
ptokens.utils.helpers.pTokenNameNormalized(pTokenName)
```

Returns a pToken name normalized (lower case)

### Parameters

- __`String`__ - __`pTokenName`__: pToken name

### Returns

- __`Boolean`__ : pToken name normalized

### Example
```js
utils.helpers.pTokenNameNormalized('pEOS') //peos
```

&nbsp;

***

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
ptokens.utils.eth.addHexPrefix(text)
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
ptokens.utils.eth.addHexPrefix(amount, decimals, operation)
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
ptokens.utils.eth.getAccount(web3, isWeb3Injected)
```

Returns the current Ethereum address given an instance of Web3 and specifying if it's injected (i.e.: a Web3 instance injected by Metamask)

### Parameters

- __`Object`__ - __`Web3`__: Web3 instance
- __`Boolean`__ - __`isWeb3Injected`__: specifies if it's an injected Web3 instance


### Returns

- __`Promise`__ : when resolved it returns the current Ethereum address

### Example
```js
const account = await utils.eth.getAccount(web3, true)
```

&nbsp;

## eth.getContract

```js
ptokens.utils.eth.getContract(web3, abi, contractAddress, account)
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
ptokens.utils.eth.getGasLimit(web3)
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
ptokens.utils.eth.isHexPrefixed(text)
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
ptokens.utils.eth.makeContractCall(web3, method, options, params = [])
```

Performs a contract `call` given a Web3 instance and the Smart Contract details.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`String`__ - __`method`__: Smart Contract method to call
- __`Object`__ - __`options`__
    - __`Object`__ - __`abi`__: Smart Contract json interface
    - __`String`__ - __`contractAddress`__: Smart Contract address
    - __`Boolean`__ - __`isWeb3Injected`__: status of the provided Web3 instance (injected or not)
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved it returns the value returned by the Smart Contract

### Example
```js
const options = {
  abi,
  contractAddess: 'eth contract address',
}
const value = await utils.eth.makeContractCall(web3, 'balanceOf', true, abi, '' , ['eth address']) //true
```

&nbsp;

## eth.makeContractSend

```js
ptokens.utils.eth.makeContractSend(web3, method, options, params = [])
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
    - __`Boolean`__ - __`isWeb3Injected`__: status of the provided Web3 instance (injected or not)
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved it returns the receipt of the transaction performed

### Example
```js
const receipt = await utils.eth.makeContractSend(web3, 'transfer', true, abi, 'eth contract address' , ['eth address']) //true
```

***

&nbsp;

## utils.eos

* __`getApi`__
* __`getAccountName`__
* __`getAvailablePublicKeys`__
* __`isValidAccountName`__
* __`transferNativeToken`__

***

## eos.getApi

```js
ptokens.utils.eos.getApi(privateKey, rpc)
```

Returns an instance of `eosjs`

### Parameters

- __`String`__ - __`privateKey`__: EOS account private key
- __`String`__ - __`rpc`__: EOS provider rpc
- __`String`__ - __`signatureProvider`__: EOS Signature Provider (can be null if `privateKey` is used)

### Returns

- __`Object`__ : an instance of `eosjs`

### Example
```js
const eosjs = utils.eos.getApi('private key', 'rpc url', signatureProvider = null)
```

&nbsp;

## eos.getAccountName

```js
ptokens.utils.eos.getAccountName(eosjs, pubkeys)
```

Returns the current account name given an instance of `eosjs` and a list of public keys

### Parameters

- __`String`__ - __`eosjs`__: initialized instance of `eosjs`
- __`String`__ - __`pubkeys`__: list of EOS public keys


### Returns

- __`Promise`__ : when resolved return the current EOS account name

### Example
```js
const accountName = await utils.eos.getAccountName(eosjs, ['pubk1', 'pubk2'])
```

&nbsp;

## eos.getAvailablePublicKeys

```js
ptokens.utils.eos.getAvailablePublicKeys(eosjs)
```

Returns the available public keys given an instance of `eosjs`

### Parameters

- __`String`__ - __`eosjs`__: initialized instance of `eosjs`


### Returns

- __`Promise`__ : when resolved it return a list of public keys

### Example
```js
const publicKeys = await utils.eos.getAvailablePublicKeys(eosjs)
```

&nbsp;

## eos.isValidAccountName

```js
ptokens.utils.eos.isValidAccountName(accountName)
```

Check if the provided EOS `accountName` is valid 

### Parameters

- __`String`__ - __`accountName`__: EOS account name


### Returns

- __`Boolean`__ : EOS account name validity

### Example
```js
const isValid = utils.eos.isValidAccountName('all3manfr3di') //true
```

&nbsp;


## eos.transferNativeToken

```js
ptokens.utils.eos.transferNativeToken(eosjs, to, accountName, amount, memo, blocksBehind, expireSeconds)
```

Sends an amount of EOS native token (`eosio.token`)

### Parameters

- __`Object`__ - __`eosjs`__: initialized instance of `eosjs`
- __`String`__ - __`to`__: EOS account where to send EOS
- __`String`__ - __`accountName`__: EOS sender account name
- __`Number`__ - __`amount`__: amount of EOS to send
- __`String`__ - __`memo`__: EOS memo
- __`Number`__ - __`blocksBehind`__: how many blocks the head block is behind 
- __`Number`__ - __`expireSeconds`__: time after which the transaction can never be included in a block, in seconds


### Returns

- __`Promise`__ : when resolved it returns the EOS transaction receipt

### Example
```js
const receipt = utils.eos.transferNativeToken(eosjs, 'eos account receiver', 'eos account sender', 100, 'memo', 3, 60)
```

&nbsp;
