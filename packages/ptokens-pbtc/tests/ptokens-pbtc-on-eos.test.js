import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const pbtcOnEosConfigs = {
  blockchain: 'EOS',
  network: 'testnet',
  eosRpc: new JsonRpc('http://23.97.190.44:8888', { fetch }),
  eosPrivateKey: '5JFPd8Kvhf7zSrxKCrMvhK22WKbh1jFw5TLeLjyPpp2yh4SvReS'
}

const EOS_TESTING_ACCOUNT_NAME = 'all3manfr4di'

const BTC_TESTING_PRIVATE_KEY =
  '8d31f05cbb64ebb1986f64f70959b8cdcb528c2b095d617fd0bbf1e5c0f7ec07'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

jest.setTimeout(3000000)

test('Should get a BTC deposit address on EOS Jungle3 Testnet', async () => {
  const pbtc = new pBTC(pbtcOnEosConfigs)

  const depositAddress = await pbtc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should get a BTC deposit address on EOS Mainnet', async () => {
  const pbtc = new pBTC({
    blockchain: 'EOS',
    network: 'mainnet'
  })

  const depositAddress = await pbtc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a BTC deposit address because of invalid EOS account', async () => {
  const pbtc = new pBTC({
    blockchain: 'EOSIO',
    network: 'testnet'
  })

  const invalidEosAddress = 'invalid test account'

  try {
    await pbtc.getDepositAddress(invalidEosAddress)
  } catch (err) {
    expect(err.message).to.be.equal('EOS Account is not valid')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on EOS Jungle3 Testnet', async () => {
  const pbtc = new pBTC(pbtcOnEosConfigs)

  const amountToIssue = 50100
  const minerFees = 1000

  const depositAddress = await pbtc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)

  await sendBitcoin(
    BTC_TESTING_PRIVATE_KEY,
    BTC_TESTING_ADDRESS,
    amountToIssue,
    minerFees,
    depositAddress.toString()
  )

  let btcTxIsBroadcasted = false
  let btcTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onBtcTxBroadcasted', () => {
          btcTxIsBroadcasted = true
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('onEosTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.000051 pBTC on EOS Jungle3 Testnet', async () => {
  const pbtc = new pBTC(pbtcOnEosConfigs)

  const amountToRedeem = 0.000051

  let eosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let btcTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS)
        .once('onEosTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(eosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
})
