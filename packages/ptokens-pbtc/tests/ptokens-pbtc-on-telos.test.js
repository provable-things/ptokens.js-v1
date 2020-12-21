import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
// import qrcode from 'qrcode-terminal'

const TELOS_PRIVATE_KEY = ''
const TELOS_TESTING_ACCOUNT_NAME = ''
const TELOS_RPC_URL = ''
const BTC_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_ADDRESS = ''

jest.setTimeout(3000000)

let pbtc
beforeEach(() => {
  pbtc = new pBTC({
    nativeNetwork: constants.networks.BitcoinMainnet,
    nativeBlockchain: constants.blockchains.Bitcoin,
    hostNetwork: constants.networks.TelosMainnet,
    hostBlockchain: constants.blockchains.Telos,
    eosRpc: new JsonRpc(TELOS_RPC_URL, { fetch }),
    eosPrivateKey: TELOS_PRIVATE_KEY
  })
})

test('Should get a BTC deposit address on Telos Mainnet', async () => {
  const depositAddress = await pbtc.getDepositAddress(TELOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a BTC deposit address because of invalid Telos account', async () => {
  const invalidEosAddress = 'invalid test account'
  try {
    await pbtc.getDepositAddress(invalidEosAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid Telos Account')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on Telos', async () => {
  const amountToIssue = 50100
  const minerFees = 1000
  const depositAddress = await pbtc.getDepositAddress(TELOS_TESTING_ACCOUNT_NAME)

  // if you want for example send btc from a phone
  /* qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  }) */

  await sendBitcoin(BTC_TESTING_PRIVATE_KEY, BTC_TESTING_ADDRESS, amountToIssue, minerFees, depositAddress.toString())

  let btcTxIsBroadcasted = false
  let btcTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let telosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('nativeTxBroadcasted', () => {
          btcTxIsBroadcasted = true
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          telosTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(telosTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.0001 pBTC on Telos', async () => {
  const amountToRedeem = 0.0001
  let telosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let btcTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('hostTxConfirmed', () => {
          telosTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(telosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
})
