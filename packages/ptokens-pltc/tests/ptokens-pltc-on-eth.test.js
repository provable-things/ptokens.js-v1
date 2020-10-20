import { pLTC } from '../src/index'
import { expect } from 'chai'
import { sendLitecoin } from './utils'
import { constants } from 'ptokens-utils'
import qrcode from 'qrcode-terminal'

const ETH_TESTING_ADDRESS = ''
// prettier-ignore
const ETH_TESTING_PRIVATE_KEY = ''
// prettier-ignore
const LTC_TESTING_PRIVATE_KEY = ''
const LTC_TESTING_ADDRESS = ''
// prettier-ignore
const WEB3_PROVIDER = ''

jest.setTimeout(3000000)

let pltc
beforeEach(() => {
  pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
})

test('Should get a LTC deposit address on Ethereum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'
  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pltc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a LTC deposit address because of invalid Eth address', async () => {
  const invalidEthAddress = 'Invalid Eth Address'
  try {
    await pltc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Invalid Ethereum Address')
  }
})

test('Should monitor an issuing of 0.001 pLTC on Ethereum', async () => {
  const amountToIssue = 100000
  const minerFees = 100000
  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)

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
  let ethTxIsConfirmed = 0
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
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .then(() => resolve())
    })
  await start()

  expect(ltcTxIsBroadcasted).to.equal(2)
  expect(ltcTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(ethTxIsConfirmed).to.equal(2)
})

test('Should monitoring a redeem of 0.001 pLTC on Ethereum', async () => {
  const amountToRedeem = 0.001
  let ethTxBroadcasted = 0
  let ethTxIsConfirmed = 0
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
        .once('onEthTxBroadcasted', () => {
          ethTxBroadcasted += 1
        })
        .once('nativeTxBroadcasted', () => {
          ethTxBroadcasted += 1
        })
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
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
    })
  await start()
  expect(ethTxBroadcasted).to.equal(2)
  expect(ethTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(ltcTxIsConfirmed).to.equal(2)
})
