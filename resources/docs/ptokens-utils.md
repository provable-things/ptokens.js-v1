# ptokens-utils

This module allows to have access to some usefull utility used by other packages.

### Installation

It is possible to install individually this package without installing the main one (__`ptokens`__).

```
npm install ptokens-utils
```

***

## utils.eth

* __`alwaysWithPrefix`__
* __`correctFormat`__
* __`getAccount`__
* __`getContract`__
* __`getGasLimit`__
* __`is0xPrefixed`__
* __`makeContractCall`__
* __`makeContractSend`__
* __`makeTransaction`__
* __`sendSignedMethodTx`__

***


## eth.alwaysWithPrefix

```js
ptokens.utils.eth.alwaysWithPrefix(text)
```

Return a string always `0x` prefixed

### Parameters

- __`String`__ - __`text`__: text

### Returns

- __`String`__ : a string `0x` prefixed 

### Example
```js
const res = utils.eth.alwaysWithPrefix('hello') //0xhello
```

&nbsp;

## eth.correctFormat

```js
ptokens.utils.eth.alwaysWithPrefix(amount, decimals, operation)
```

Return a number equal to the `amount` divied/multiplied (`operation`) by `decimals` (usefull for erc20 token).

### Parameters

- __`Number`__ - __`amount`__: on chain amount
- __`String`__ - __`decimals`__: number of decimals
- __`Character`__ - __`operation`__: `*` or `/`

### Returns

- __`Number`__ : a formatted number correctly

### Example
```js
const res = utils.eth.correctFormat(1000, 4, '/') //0.1
```

&nbsp;

## eth.getAccount

```js
ptokens.utils.eth.getAccount(web3, isWeb3Injected)
```

Return the current Ethereum address given an instance of Web3 and specifying if it's injected (ex: Web3 instance injected by Metamask)

### Parameters

- __`Object`__ - __`Web3`__: Web3 instance
- __`Boolean`__ - __`isWeb3Injected`__: specifies if it's an injected Web3 instance


### Returns

- __`Promise`__ : whene resolved returns the current Ethereum address

### Example
```js
const account = await utils.eth.getAccount(web3, true)
```

&nbsp;

## eth.getContract

```js
ptokens.utils.eth.getContract(web3, abi, contractAddress, account)
```

Return a [Web3.eth.Contract](https://web3js.readthedocs.io/en/v1.2.0/Web3-eth-contract.html) instance given a Web3 one, the contract abi, its address (`contractAddress`) and the address (`account`) where transactions should be made from

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

Return the gas limit of the latest Ethereum block.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance

### Returns

- __`Promise`__ : when resolved returns the current gas limit

### Example
```js
const gasLimit = await utils.eth.getGasLimit(web3)
```

&nbsp;

## eth.is0xPrefixed

```js
ptokens.utils.eth.is0xPrefixed(text)
```

Check if a given string (`text`) is `0x` prefixed

### Parameters

- __`String`__ - __`text`__: text

### Returns

- __`Boolean`__ : `0x` prefix cheking result

### Example
```js
const is0xPrefixed = await utils.eth.is0xPrefixed('0xhello') //true
```

&nbsp;

## eth.makeContractCall

```js
ptokens.utils.eth.makeContractCall(web3, method, options, params = [])
```

Perform a contract `call` given a Web3 instance and the Smart Contract details.

### Parameters

- __`Object`__ - __`web3`__: Web3 instance
- __`String`__ - __`method`__: Smart Contract method to call
- __`Object`__ - __`options`__
    - __`Object`__ - __`abi`__: Smart Contract json interface
    - __`String`__ - __`contractAddress`__: Smart Contract address
    - __`Boolean`__ - __`isWeb3Injected`__: status of the provided Web3 instance (injected or not)
- __`Array`__ - __`params`__: parameters nedeed for calling the method specified

### Returns

- __`Promise`__ : when resolved returns the value returned by the Smart Contract

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

Perform a contract `send` given a Web3 instance and the Smart Contract details.

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

- __`Promise`__ : when resolved returns the receipt of the transaction performed

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

Return an instance of `eosjs`

### Parameters

- __`String`__ - __`privateKey`__: EOS account private key
- __`String`__ - __`rpc`__: EOS provider rpc


### Returns

- __`Object`__ : an instance of `eosjs`

### Example
```js
const eosjs = utils.eos.getApi('private key', 'rpc url')
```

&nbsp;

## eos.getAccountName

```js
ptokens.utils.eos.getAccountName(eosjs, pubkeys)
```

Return the current account name given an instance of `eosjs` and a list of public keys

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

Return the available public keys given an instance of `eosjs`

### Parameters

- __`String`__ - __`eosjs`__: initialized instance of `eosjs`


### Returns

- __`Promise`__ : when resolved return a list of public keys

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

Send an amount of EOS native token (`eosio.token`)

### Parameters

- __`String`__ - __`eosjs`__: initialized instance of `eosjs`
- __`String`__ - __`to`__: EOS account to send EOS
- __`String`__ - __`accountName`__: EOS sender account name
- __`String`__ - __`amount`__: amount of EOS to send
- __`String`__ - __`memo`__: EOS memo
- __`String`__ - __`blocksBehind`__: how many blocks is behind the head block
- __`String`__ - __`expireSeconds`__: time after which the transaction can never be included in a block


### Returns

- __`Promise`__ : when resolved returns the EOS transaction receipt

### Example
```js
const receipt = utils.eos.transferNativeToken(eosjs, 'eos account receiver', 'eos account sender', 100, 'memo', 3, 60)
```

&nbsp;