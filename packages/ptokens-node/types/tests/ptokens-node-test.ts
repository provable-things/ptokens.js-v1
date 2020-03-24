import { Node } from 'ptokens-node'
import { EventEmitter } from 'events'

const HASH_INCOMING_TX =
  'a177f86e24eb3ffc0a272f7f0bd6cb8fb6acb97a67ac211a7863b12dfcec1a29'
const HASH_BROADCASTED_TX =
  '0xac53ba6214ad2b0513fd6d69ab2c39a6649fc83a61048eb5d4aebad80f0cbe30'

const BTC_TESTING_ADDRESS = '2NFLTr9nFbnexQgRP3hpEH5NKduvqpiAUpw'

const node = new Node({
  pToken: 'pBTC',
  blockchain: 'ETH',
  endpoint: 'https://nuc-bridge-3.ngrok.io'
})

// $ExpectType Promise<string>
node.ping()

// $ExpectType Promise<NodeInfo>
node.getInfo()

// $ExpectType Promise<ReportList>
node.getReports('native', 10)

// $ExpectType Promise<ReportList>
node.getReportsByAddress('native', BTC_TESTING_ADDRESS, 10)

// $ExpectType Promise<Report>
node.getReportByNonce('native', 1)

// $ExpectType Promise<number>
node.getLastProcessedBlock('native')

// $ExpectType Promise<Report>
node.getIncomingTransactionStatus(HASH_INCOMING_TX)

// $ExpectType Promise<Report>
node.getBroadcastTransactionStatus(HASH_BROADCASTED_TX)

// $ExpectType Promise<Report>
node.monitorIncomingTransaction(HASH_INCOMING_TX, new EventEmitter())
