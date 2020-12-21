import { pERC20 } from '../src/index'
import { expect } from 'chai'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const WEB3_PROVIDER = ''
const EOS_TESTING_PRIVATE_KEY = ''
const EOS_TESTING_NODE_ENDPOINT = ''
const EOS_TESTING_ACCOUNT_NAME = ''

jest.setTimeout(3000000)

let peth = null
beforeEach(() => {
  peth = new pERC20({
    blockchain: constants.blockchains.Eosio,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER,
    eosRpc: new JsonRpc(EOS_TESTING_NODE_ENDPOINT, { fetch }),
    eosPrivateKey: EOS_TESTING_PRIVATE_KEY,
    pToken: constants.pTokens.pETH
  })
})

test('Should not issue less than 1000000000 pETH', async () => {
  const amountToIssue = BigNumber('900000000')
  try {
    await peth.issue(amountToIssue, EOS_TESTING_ACCOUNT_NAME)
  } catch (_err) {
    expect(_err).to.be.equal('Impossible to issue less than 1000000000')
  }
})

test('Should issue 0.002 pETH using ETH', async () => {
  const amountToIssue = BigNumber('2000000000000000')
  let ethTxBrodcasted = 2
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      peth
        .issue(amountToIssue, EOS_TESTING_ACCOUNT_NAME, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('nativeTxBroadcasted', () => {
          ethTxBrodcasted = true
        })
        .once('nativeTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()
  expect(ethTxBrodcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.0005 pETH on EOS', async () => {
  const amountToRedeem = 0.0005
  let eosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      peth
        .redeem(amountToRedeem, ETH_TESTING_ADDRESS)
        .once('hostTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})
