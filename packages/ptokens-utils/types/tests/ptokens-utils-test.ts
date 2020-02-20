import {
  btc,
  converters,
  eth,
  helpers,
  ltc
} from 'ptokens-utils'
import { EventEmitter } from 'events'
import Web3 from 'web3'

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

// $ExpectType Promise<EthereumTransactionReceipt>
eth.makeContractCall(
  new Web3(),
  'get',
  {
    abi: [{ param1: '' }],
    contractAddress: ETH_TESTING_CONTRACT_ADDRESS
  },
  []
)

// $ExpectType Promise<EthereumTransactionReceipt>
eth.makeContractSend(
  new Web3(),
  'write',
  {
    abi: [{ param1: '' }],
    contractAddress: ETH_TESTING_CONTRACT_ADDRESS
  },
  ['hello']
)

// $ExpectType Promise<EthereumTransactionReceipt>
eth.waitForTransactionConfirmation(new Web3(), ETH_TESTING_TX, 1000)

// helpers

// $ExpectType boolean
helpers.pTokenNameIsValid('pBTC')

// $ExpectType boolean
helpers.pTokenIsValid({ name: 'pBTC', redeemFrom: 'ETH'})

// litecoin
const LTC_RAW_TX = "0200000001c266c9f18cf5fe20cdbf107230e838f363b307d399fa4c29e8fd31dfda9cbf88000000006b483045022100bd9d134bc09c8a9760b3f62e768958cf82dcd3c556057f07113c18df2448b07c02206d16246c08a262e6c0d4a8e24be6135ba2d84583af9c0fdd36b633e22b6374a3012103571c595ea1b39832d33ebcf519b551b056298654229e67ed8964ba1ecf388402ffffffff02f40100000000000017a914e1c311b8a6584fde5b55292d8ef44addf1c9134487a4909800000000001976a914329d43938a947149be392f93f152da34ef32a49a88ac00000000"
const LTC_TESTING_ADDRESS = 'n1qkF2NzY1v5Jj41zSJZRVJE1rJDRyoFzs'
const LTC_UTXO = '6ccb55376f6615ddbc9dca91187f2e3fe9fcd4a3aa2a8a88ca0c5ccb30b891f6'

// $ExpectType Promise<LitecoinBroadcastedTx>
ltc.broadcastTransaction('testnet', LTC_RAW_TX)

// $ExpectType Promise<LitecoinUtxoList>
ltc.getUtxoByAddress('testnet', LTC_TESTING_ADDRESS)

// $ExpectType Promise<string>
ltc.getTransactionHexById('testnet', LTC_UTXO)

// $ExpectType boolean
ltc.isValidAddress('testnet', LTC_TESTING_ADDRESS)

// $ExpectType Promise<string>
ltc.monitorUtxoByAddress('testnet', LTC_TESTING_ADDRESS, new EventEmitter(), 1000)

// $ExpectType Promise<LitecoinTransactionReceipt>
ltc.waitForTransactionConfirmation('testnet', LTC_UTXO, 10000)
