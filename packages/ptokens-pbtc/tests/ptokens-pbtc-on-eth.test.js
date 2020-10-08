import { pBTC } from '../src/index'
import { expect } from 'chai'
import { sendBitcoin } from './utils'
import { constants } from 'ptokens-utils'

// prettier-ignore
const INFURA_ROPSTEN = 'https://ropsten.infura.io/v3/4762c881ac0c4938be76386339358ed6'

const ETH_TESTING_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
// prettier-ignore
const BTC_TESTING_PRIVATE_KEY = '8d31f05cbb64ebb1986f64f70959b8cdcb528c2b095d617fd0bbf1e5c0f7ec07'
// prettier-ignore
const ETH_TESTING_PRIVATE_KEY = '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742'
const BTC_TESTING_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

const pbtcOnEthConfigs = {
  blockchain: constants.blockchains.Ethereum,
  network: constants.networks.Testnet,
  ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
  ethProvider: INFURA_ROPSTEN
}

jest.setTimeout(3000000)

test('Should get a BTC deposit address on Ethereum Mainnet', async () => {
  const expectedHostNetwork = 'mainnet'

  const pbtc = new pBTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet
  })

  const depositAddress = await pbtc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pbtc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should get a BTC deposit address on Ethereum Ropsten', async () => {
  const expectedHostNetwork = 'testnet_ropsten'

  const pbtc = new pBTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.EthereumRopsten
  })

  const depositAddress = await pbtc.getDepositAddress(ETH_TESTING_ADDRESS)
  expect(depositAddress.toString()).to.be.a('string')
  expect(pbtc.hostNetwork).to.be.equal(expectedHostNetwork)
})

test('Should not get a BTC deposit address because of invalid Eth address', async () => {
  const pbtc = new pBTC({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Testnet
  })

  const invalidEthAddress = 'Invalid Eth Address'

  try {
    await pbtc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Eth Address is not valid')
  }
})

test('Should monitor an issuing of 0.00050100 pBTC on Ethereum Testnet', async () => {
  const pbtc = new pBTC(pbtcOnEthConfigs)

  const amountToIssue = 50100
  const minerFees = 1000

  const depositAddress = await pbtc.getDepositAddress(ETH_TESTING_ADDRESS)

  await sendBitcoin(
    BTC_TESTING_PRIVATE_KEY,
    BTC_TESTING_ADDRESS,
    amountToIssue,
    minerFees,
    depositAddress.toString()
  )

  let btcTxIsBroadcasted = 0
  let btcTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let ethTxIsConfirmed = 0
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
        .once('onEthTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed += 1
        })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(ethTxIsConfirmed).to.equal(2)
})

test('Should redeem 0.000051 pBTC on Ethereum', async () => {
  const pbtc = new pBTC(pbtcOnEthConfigs)

  const amountToRedeem = 0.000051

  let ethTxBroadcasted
  let ethTxIsConfirmed = 0
  let nodeHasReceivedTx = 0
  let nodeHasBroadcastedTx = 0
  let btcTxIsConfirmed = 0
  const start = () =>
    new Promise((resolve, reject) => {
      pbtc
        .redeem(amountToRedeem, BTC_TESTING_ADDRESS)
        .once('onEthTxBroacasted', () => {
          ethTxBroadcasted += 1
        })
        .once('nativeTxBroacasted', () => {
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
        .once('onNodeBroadcastedTx', e => {
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

  expect(ethTxBroadcasted).to.equal(2)
  expect(ethTxIsConfirmed).to.equal(2)
  expect(nodeHasReceivedTx).to.equal(2)
  expect(nodeHasBroadcastedTx).to.equal(2)
  expect(btcTxIsConfirmed).to.equal(2)
})
