import { pEOSToken } from '../src/index'
import { expect } from 'chai'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const WEB3_PROVIDER = ''
const EOS_TESTING_ACCOUNT_NAME = ''
const EOS_RPC_URL = ''
const EOS_TESTING_PRIVATE_KEY = ''

jest.setTimeout(3000000)

let peos
beforeEach(() => {
  peos = new pEOSToken({
    pToken: constants.pTokens.pEOS,
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER,
    eosRpc: new JsonRpc(EOS_RPC_URL, { fetch }),
    eosPrivateKey: EOS_TESTING_PRIVATE_KEY
  })
})

test('Should monitor an issuing of 0.005 pEOSToken on ETH', async () => {
  const amountToIssue = '0.005'
  let eosTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      peos
        .issue(amountToIssue, ETH_TESTING_ADDRESS, { blocksBehind: 3, expireSeconds: 60 })
        .once('nativeTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .then(() => resolve())
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.005 pEOS from ETH', async () => {
  const amountToRedeem = BigNumber(0.005).multipliedBy(10 ** 18)
  let ethTxIsBroadcasted = false
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      peos
        .redeem(amountToRedeem, EOS_TESTING_ACCOUNT_NAME, {
          gasPrice: 75e9,
          gas: 200000
        })
        .once('hostTxBroadcasted', () => {
          ethTxIsBroadcasted = true
        })
        .once('hostTxConfirmed', () => {
          ethTxIsConfirmed = true
        })
        .once('nodeReceivedTx', () => {
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', () => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', () => {
          eosTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(ethTxIsBroadcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})
