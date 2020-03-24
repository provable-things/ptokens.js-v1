import {
  btc,
  converters,
  eth,
  eos,
  helpers
} from 'ptokens-utils'
import { EventEmitter } from 'events'
import Web3 from 'web3'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

// btc
const BTC_RAW_TX = "020000000001011333183ddf384da83ed49296136c70d206ad2b19331bf25d390e69b222165e370000000017160014b93f973eb2bf0b614bddc0f47286788c98c535b4feffffff0200e1f5050000000017a914a860f76561c85551594c18eecceffaee8c4822d787f0c1a4350000000017a914d8b6fcc85a383261df05423ddf068a8987bf028787024730440220434caf5bb442cb6a251e8bce0ec493f9a1a9c4423bcfc029e542b0e8a89d1b3f022011090d4e98f79c62b188245a4aa4eb77e912bfd57e0a9b9a1c5e65f2b39f3ab401210223bec70d670d29a30d9bcee197910e37cf2a10f0dc3c5ac44d865aec0d7052fb8c000000"
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'
const BTC_UTXO = '02aa5b687d4ea0d5d2bce9801d525692322e0e4ed073a82001f2e3f8b6fb1a05'

// $ExpectType Promise<BitcoinBroadcastedTx>
btc.broadcastTransaction('testnet', BTC_RAW_TX)

// $ExpectType Promise<BitcoinUtxoList>
btc.getUtxoByAddress('testnet', BTC_TESTING_ADDRESS)

// $ExpectType Promise<string>
btc.getTransactionHexById('testnet', BTC_UTXO)

// $ExpectType boolean
btc.isValidAddress(BTC_TESTING_ADDRESS)

// $ExpectType Promise<string>
btc.monitorUtxoByAddress('testnet', BTC_TESTING_ADDRESS, new EventEmitter(), 1000)

// $ExpectType Promise<BitcoinTransactionReceipt>
btc.waitForTransactionConfirmation('testnet', BTC_UTXO, 10000)

// converters

// $ExpectType number
converters.decodeUint64le(new Buffer('474633d2'))

// $ExpectType Buffer
converters.encodeUint64le(10)

// eth
const ETH_TESTING_CONTRACT_ADDRESS = '0x15FA11dFB23eae46Fda69fB6A148f41677B4a090'
const ETH_TESTING_ADDRESS = '0x1f0b6A3AC984B4c990d8Ce867103E9C384629747'
const ETH_TESTING_TX =
  '0xcbda0526ef6f74583e0af541e3e8b25542130691bddea2fdf5956c8e1ea783e5'

// $ExpectType string
eth.addHexPrefix('hello')

// $ExpectType string
eth.removeHexPrefix('0xhello')

// $ExpectType number
eth.correctFormat(10000, 3, '/')

// $ExpectType string
eth.getAccount(new Web3(), true)

// $ExpectType object
eth.getContract(new Web3(), [{ param1: '' }], ETH_TESTING_CONTRACT_ADDRESS, ETH_TESTING_ADDRESS)

// $ExpectType number
eth.getGasLimit(new Web3())

// $ExpectType boolean
eth.isHexPrefixed('hello')

// $ExpectType Promise<TransactionReceipt>
eth.makeContractCall(
  new Web3(),
  'get',
  {
    abi: [{ param1: '' }],
    contractAddress: ETH_TESTING_CONTRACT_ADDRESS
  },
  []
)

// $ExpectType Promise<TransactionReceipt>
eth.makeContractSend(
  new Web3(),
  'write',
  {
    abi: [{ param1: '' }],
    contractAddress: ETH_TESTING_CONTRACT_ADDRESS
  },
  ['hello']
)

// $ExpectType Promise<TransactionReceipt>
eth.waitForTransactionConfirmation(new Web3(), ETH_TESTING_TX, 1000)

// eos

const jsonRpc = new JsonRpc('endpoint')
const signatureProvider = new JsSignatureProvider(['privK1, privK2'])

const eosApi = new Api({
  rpc: jsonRpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
})

// $ExpectType Api
eos.getApi('private key', 'node endpoint', signatureProvider)

// $ExpectType Promise<string>
eos.getAccountName(jsonRpc, ['pubK1, pubK2'])

// $ExpectType Promise<string[]>
eos.getAvailablePublicKeys(signatureProvider)

// $ExpectType number
eos.getAmountInEosFormat(20000, 4)

// $ExpectType boolean
eos.isValidAccountName('all3manfr3di')

// $ExpectType Promise<any>
eos.transferNativeToken(eosApi, 'to', 'all3manfr3di', 200, 'memo', 3, 4)

// $ExpectType Promise<any>
eos.waitForTransactionConfirmation(eosApi, 'txId')

// helpers

// $ExpectType ParsedParams
helpers.parseParams({
  hostBlockchain: 'ETH',
  hostNetwork: 'testnet_ropsten',
  nativeBlockchain: 'BTC',
  nativeNetwork: 'testnet'
}, 'btc')

// $ExpectType string
helpers.getBlockchainType('eth')

// $ExpectType string
helpers.getBlockchainShortType('ethereum')

// $ExpectType string
helpers.getNetworkType('testnet_ropsten')

// $ExpectType string
helpers.getNativeBlockchainFromPtokenName('pBTC')

// $ExpectType boolean
helpers.isValidPTokenName('pBTC')
