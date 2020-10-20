import { pLTC } from '../src/index'
import { expect } from 'chai'
import { sendLitecoin } from './utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
import qrcode from 'qrcode-terminal'

// prettier-ignore
const EOS_PRIVATE_KEY = ''
const EOS_TESTING_ACCOUNT_NAME = ''
const EOS_RPC_URL = ''
// prettier-ignore
const LTC_TESTING_PRIVATE_KEY = ''
const LTC_TESTING_ADDRESS = ''
jest.setTimeout(3000000)

let pltc
beforeEach(() => {
  pltc = new pLTC({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet,
    eosRpc: new JsonRpc(EOS_RPC_URL, { fetch }),
    eosPrivateKey: EOS_PRIVATE_KEY
  })
})

test('Should get a LTC deposit address on EOS Mainnet', async () => {
  const depositAddress = await pltc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a LTC deposit address because of invalid EOS account', async () => {
  const invalidEosAddress = 'invalid test account'
  try {
    await pltc.getDepositAddress(invalidEosAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid EOS Account')
  }
})

test('Should monitor an issuing of 0.05 pLTC on EOS', async () => {
  const amountToIssue = 5000000
  const minerFees = 1000
  const depositAddress = await pltc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)

  // if you want for example send ltc from a phone
  /*qrcode.generate(depositAddress.toString(), { small: true }, _qrcode => {
    console.log(_qrcode)
  })*/

  await sendLitecoin(
    LTC_TESTING_PRIVATE_KEY,
    LTC_TESTING_ADDRESS,
    amountToIssue,
    minerFees,
    depositAddress.toString()
  )

  let ltcTxIsBroadcasted = 0
  let ltcTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let eosTxIsConfirmed = 0
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onLtcTxBroadcasted', () => {
          ltcTxIsBroadcasted += 1
        })
        .once('nativeTxBroadcasted', () => {
          ltcTxIsBroadcasted += 1
        })
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', () => {
          ltcTxIsConfirmed += 1
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx += 1
        })
        .once('nodeReceivedTx', e => {
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
  expect(ltcTxIsBroadcasted).to.equal(2)
  expect(ltcTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(eosTxIsConfirmed).to.equal(2)
})

test('Should redeem 0.05 pLTC on EOS', async () => {
  const amountToRedeem = 0.05
  let eosTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let ltcTxIsConfirmed = 0
  const start = () =>
    new Promise((resolve, reject) => {
      pltc
        .redeem(amountToRedeem, LTC_TESTING_ADDRESS, {
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
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed += 1
        })
        .once('nativeTxConfirmed', e => {
          ltcTxIsConfirmed += 1
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(ltcTxIsConfirmed).to.equal(2)
})
