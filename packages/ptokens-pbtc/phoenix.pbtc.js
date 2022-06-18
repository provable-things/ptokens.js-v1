const { pBTC } = require('./dist/ptokens-pbtc.cjs')

const PHOENIX_DESTINATION_ACCOUNT = 'phoenix-account'
const BTC_DESTINATION_ADDRESS = 'btc-destination-account'
const PEGOUT_AMOUNT = 0.001
const PHOENIX_ACTIVE_PRIVATE_KEY = 'phoenix-active-private-key'

const pbtc = new pBTC({
  nativeBlockchain: 'bitcoin',
  nativeNetwork: 'mainnet',
  hostBlockchain: 'phoenix',
  hostNetwork: 'mainnet',
  eosRpc: ' http://libre.eosusa.io',
  eosPrivateKey: PHOENIX_ACTIVE_PRIVATE_KEY
})

async function pegin(_destAddress) {
  const depositAddress = await pbtc.getDepositAddress(_destAddress)
  if (!depositAddress.verify()) console.error('Node deposit address does not match expected address')
  console.info('deposit address', depositAddress.toString())
  const promi = depositAddress.waitForDeposit()
  promi
    .once('nativeTxBroadcasted', _tx => {
      console.info('nativeTxBroadcasted', _tx)
    })
    .once('nativeTxConfirmed', () => {
      console.info('nativeTxConfirmed')
    })
    .once('nodeReceivedTx', () => {
      console.info('nodeReceivedTx')
    })
    .once('nodeBroadcastedTx', _report => {
      console.info('nodeBroadcastedTx', _report.broadcast_tx_hash)
    })
    .then(_result => {
      console.info('end of swap!')
    })
    .catch(_err => {
      console.error(_err)
    })
}

function pegout(_amount, _btcAddress) {
  pbtc
    .redeem(_amount, _btcAddress, { blocksBehind: 3, expireSeconds: 30, permission: 'active', actor: 'pnettest1' })
    .once('hostTxConfirmed', _receipt => {
      console.info('hostTxConfirmed', _receipt)
    })
    .once('nodeReceivedTx', () => {
      console.info('nodeReceivedTx')
    })
    .once('nodeBroadcastedTx', _tx => {
      console.info('nodeBroadcastedTx', _tx.broadcast_tx_hash)
    })
    .once('nativeTxConfirmed', _receipt => {
      console.info('nativeTxConfirmed', _receipt)
    })
    .catch(_err => {
      console.error(_err)
    })
}

pegin(PHOENIX_DESTINATION_ACCOUNT)

pegout(PEGOUT_AMOUNT, BTC_DESTINATION_ADDRESS)
