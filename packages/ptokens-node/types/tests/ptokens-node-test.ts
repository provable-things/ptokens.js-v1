import { Node } from 'ptokens-node'
import { EventEmitter } from 'events'
import { HttpProvider } from 'ptokens-providers'

const HASH_INCOMING_TX ='a177f86e24eb3ffc0a272f7f0bd6cb8fb6acb97a67ac211a7863b12dfcec1a29'
const HASH_BROADCASTED_TX = '0xac53ba6214ad2b0513fd6d69ab2c39a6649fc83a61048eb5d4aebad80f0cbe30'
const BTC_TESTING_ADDRESS = '2NFLTr9nFbnexQgRP3hpEH5NKduvqpiAUpw'
const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

const node = new Node({
  pToken: 'pBTC',
  blockchain: 'ETH',
  provider: new HttpProvider('endpoint')
})

// $ExpectType Promise<string>
node.ping()

// $ExpectType Promise<NodeInfo>
node.getInfo()

// $ExpectType Promise<PeerList>
node.getPeers()

// $ExpectType Promise<ReportList>
node.getNativeReports(10)

// $ExpectType Promise<ReportList>
node.getHostReports(1)

// $ExpectType Promise<ReportList>
node.getReportsBySenderAddress(BTC_TESTING_ADDRESS)

// $ExpectType Promise<ReportList>
node.getReportsByRecipientAddress(BTC_TESTING_ADDRESS)

// $ExpectType Promise<ReportList>
node.getReportsByHostAddress(BTC_TESTING_ADDRESS)

// $ExpectType Promise<Report>
node.getReportByIncomingTxHash(HASH_INCOMING_TX)

// $ExpectType Promise<Report>
node.getReportByBroadcastTxHash(HASH_BROADCASTED_TX)

// $ExpectType Promise<DepositAddress>
node.getNativeDepositAddress(ETH_TESTING_ADDRESS)

// $ExpectType Promise<number>
node.getLastProcessedNativeBlock()

// $ExpectType Promise<number>
node.getLastProcessedHostBlock()

// $ExpectType Promise<Report>
node.monitorIncomingTransaction(HASH_INCOMING_TX, new EventEmitter())
