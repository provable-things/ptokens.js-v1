import { pLTC } from '../src/index'
import { expect } from 'chai'
import { sendLitecoin } from './utils'
import { constants } from 'ptokens-utils'
import qrcode from 'qrcode-terminal'

// prettier-ignore
const ETH_TESTING_PRIVATE_KEY = '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742'
const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
// prettier-ignore
const LTC_TESTING_PRIVATE_KEY = '8c89e6daf5bcdceb294ae29e1f055e177f7bf957da4819f14365750ffdada327'
const LTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const ENDPOINT_TESTNET = 'http://nuc-bridge-2.ngrok.io'
const ENDPOINT_MAINNET = 'http://pltconeth-node-1a.ngrok.io'

// prettier-ignore
const WEB3_PROVIDER = 'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6'

jest.setTimeout(3000000)

test('Should get a LTC deposit address on Ethereum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'

  const pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })
  pltc.setSelectedNode(ENDPOINT_MAINNET)

  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pltc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should get a LTC deposit address on Ethereum Ropsten', async () => {
  const expectedHostNetwork = 'testnet_ropsten'

  const pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })
  pltc.setSelectedNode(ENDPOINT_TESTNET)

  const depositAddress = await pltc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pltc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a LTC deposit address because of invalid Eth address', async () => {
  const pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })
  pltc.setSelectedNode(ENDPOINT_TESTNET)

  const invalidEthAddress = 'Invalid Eth Address'

  try {
    await pltc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Eth Address is not valid')
  }
})

test('Should monitor an issuing of 0.001 pLTC on Ethereum Ropsten', async () => {
  const pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.EthereumRopsten,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
  pltc.setSelectedNode(ENDPOINT_TESTNET)

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

test('Should monitoring a redeem of 0.001 pLTC on Ethereum Ropsten', async () => {
  const pltc = new pLTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.EthereumMainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER
  })
  pltc.setSelectedNode(ENDPOINT_MAINNET)

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
