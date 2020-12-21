import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
// import qrcode from 'qrcode-terminal'

const EOS_PRIVATE_KEY = ''
const EOS_TESTING_ACCOUNT_NAME = ''
const EOS_RPC_URL = ''
const BTC_TESTING_PRIVATE_KEY = ''
const BTC_TESTING_ADDRESS = ''

jest.setTimeout(3000000)

let pbtc
beforeEach(() => {
  pbtc = new pBTC({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet,
    eosRpc: new JsonRpc(EOS_RPC_URL, { fetch }),
    eosPrivateKey: EOS_PRIVATE_KEY
  })
})

test('Should get a BTC deposit address on EOS Mainnet', async () => {
  const depositAddress = await pbtc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a BTC deposit address because of invalid EOS account', async () => {
  const invalidEosAddress = 'invalid test account'
  try {
    await pbtc.getDepositAddress(invalidEosAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid EOS Account')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on EOS', async () => {
  const amountToIssue = 50100
  const minerFees = 1000
  const depositAddress = await pbtc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)

  // if you want for example send btc from a phone
  /* qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  }) */

  await sendBitcoin(BTC_TESTING_PRIVATE_KEY, BTC_TESTING_ADDRESS, amountToIssue, minerFees, depositAddress.toString())

  let btcTxIsBroadcasted = 0
  let btcTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let eosTxIsConfirmed = 0
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onBtcTxBroadcasted', () => {
          btcTxIsBroadcasted += 1
        })
        .once('nativeTxBroadcasted', () => {
          btcTxIsBroadcasted += 1
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('onEosTxConfirmed', () => {
          eosTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          eosTxIsConfirmed += 1
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(eosTxIsConfirmed).to.equal(2)
})

test('Should redeem 0.000051 pBTC on EOS', async () => {
  const amountToRedeem = 0.000051
  let eosTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let btcTxIsConfirmed = 0
  const start = () =>
    new Promise((resolve, reject) => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('onEosTxConfirmed', () => {
          eosTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          eosTxIsConfirmed += 1
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx += 1
        })
        .once('onBtcTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', () => {
          btcTxIsConfirmed += 1
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
})
