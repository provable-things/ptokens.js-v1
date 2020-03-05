import { Node } from 'ptokens-node'
import { EventEmitter } from 'events'

const HASH_INCOMING_TX =
  'a177f86e24eb3ffc0a272f7f0bd6cb8fb6acb97a67ac211a7863b12dfcec1a29'
const HASH_BROADCASTED_TX =
  '0xac53ba6214ad2b0513fd6d69ab2c39a6649fc83a61048eb5d4aebad80f0cbe30'

const BTC_TESTING_ADDRESS = '2NFLTr9nFbnexQgRP3hpEH5NKduvqpiAUpw'

const BTC_PBTC_BLOCK = {
  id: '00000000000013068675dc3694319815bef985de15deb505541d70387a193e69',
  height: 1657098,
  version: 536928256,
  timestamp: 1578591247,
  tx_count: 5,
  size: 1297,
  weight: 4099,
  merkle_root:
    'd7e2095d95a0174bbe4503181b80d5d4136d088123e4057401f5ca7bdcc36718',
  previousblockhash:
    '00000000000068cfcbcc8023d97b0900d6c905f2dbf5fffef34c6b7dfb07d254',
  nonce: 729798261,
  bits: 453023995
}

const node = new Node({
  pToken: {
    name: 'pBTC',
    redeemFrom: 'ETH'
  },
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

// $ExpectType Promise<string>
node.submitBlock('native', BTC_PBTC_BLOCK)

// $ExpectType Promise<Report>
node.monitorIncomingTransaction(HASH_INCOMING_TX, new EventEmitter())
