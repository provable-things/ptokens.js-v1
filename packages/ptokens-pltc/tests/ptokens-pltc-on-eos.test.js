import { pLTC } from '../src/index'
import { expect } from 'chai'
import { sendLitecoin } from './utils'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'

const pltcOnEosConfigs = {
  blockchain: constants.blockchains.Eosio,
  network: constants.networks.Testnet,
  eosRpc: new JsonRpc('http://23.97.190.44:8888', { fetch }),
  eosPrivateKey: '5JFPd8Kvhf7zSrxKCrMvhK22WKbh1jFw5TLeLjyPpp2yh4SvReS'
}

const EOS_TESTING_ACCOUNT_NAME = 'all3manfr4di'
// prettier-ignore
const LTC_TESTING_PRIVATE_KEY = '8d31f05cbb64ebb1986f64f70959b8cdcb528c2b095d617fd0bbf1e5c0f7ec07'
const LTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

jest.setTimeout(3000000)

test('Should get a LTC deposit address on EOS Jungle3 Testnet', async () => {
  const pltc = new pLTC(pltcOnEosConfigs)

  const depositAddress = await pltc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should get a LTC deposit address on EOS Mainnet', async () => {
  const pltc = new pLTC({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet
  })

  await pltc.setSelectedNode('https://pltconeos-node-1a.ngrok.io/')

  const depositAddress = await pltc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)
  expect(depositAddress.toString()).to.be.a('string')
})

test('Should not get a LTC deposit address because of invalid EOS account', async () => {
  const pltc = new pLTC({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Testnet
  })

  const invalidEosAddress = 'invalid test account'

  try {
    await pltc.getDepositAddress(invalidEosAddress)
  } catch (err) {
    expect(err.message).to.be.equal('EOS Account is not valid')
  }
})

// NOTE: pltc on eos still not available on jungle3
test('Should monitor an issuing of 0.05 pLTC on EOS Jungle3 Testnet', async () => {
  const pltc = new pLTC(pltcOnEosConfigs)
  const amountToIssue = 5000000
  const minerFees = 1000

  const depositAddress = await pltc.getDepositAddress(EOS_TESTING_ACCOUNT_NAME)

  await sendLitecoin(
    LTC_TESTING_PRIVATE_KEY,
    LTC_TESTING_ADDRESS,
    amountToIssue,
    minerFees,
    depositAddress.toString()
  )

  let ltcTxIsBroadcasted = false
  let ltcTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      depositAddress
        .waitForDeposit()
        .once('onLtcTxBroadcasted', () => {
          ltcTxIsBroadcasted = true
        })
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed = true
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

  expect(ltcTxIsBroadcasted).to.equal(true)
  expect(ltcTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

// NOTE: pltc on eos still not available on jungle3
test('Should redeem 0.05 pLTC on EOS Jungle3 Testnet', async () => {
  const pltc = new pLTC(pltcOnEosConfigs)

  const amountToRedeem = 0.05

  let eosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ltcTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      pltc
        .redeem(amountToRedeem, LTC_TESTING_ADDRESS)
        .once('onEosTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .once('onNodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('onNodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('onLtcTxConfirmed', () => {
          ltcTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()

  expect(eosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ltcTxIsConfirmed).to.equal(true)
})
