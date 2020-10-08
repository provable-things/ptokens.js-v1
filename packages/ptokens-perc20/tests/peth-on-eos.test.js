import { pERC20 } from '../src/index'
import { expect } from 'chai'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants } from 'ptokens-utils'
import BigNumber from 'bignumber.js'

// prettier-ignore
const ETH_TESTING_ADDRESS = ''
// prettier-ignore
const ETH_TESTING_PRIVATE_KEY = ''
// prettier-ignore
const INFURA_ROPSTEN = ''
// prettier-ignore
const EOS_TESTING_PRIVATE_KEY = ''
const EOS_TESTING_NODE_ENDPOINT = ''
const EOS_TESTING_ACCOUNT_NAME = ''

const configs = {
  blockchain: constants.blockchains.Eosio,
  network: constants.networks.Testnet,
  ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
  ethProvider: INFURA_ROPSTEN,
  eosRpc: new JsonRpc(EOS_TESTING_NODE_ENDPOINT, { fetch }),
  eosPrivateKey: EOS_TESTING_PRIVATE_KEY,
  pToken: constants.pTokens.pWETH,
  tokenAddress: '0x0000000000000000000000000000000000000000'
}

jest.setTimeout(3000000)

test('Should issue 0.002 pETH using ETH', async () => {
  const peth = new pERC20(configs)
  peth.setSelectedNode('https://pethoneos-node-1a.ngrok.io')
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
        .once('nativeTxBroadcasted', e => {
          console.log(e)
          ethTxBrodcasted = true
        })
        .once('nativeTxConfirmed', e => {
          console.log(e)
          ethTxIsConfirmed = true
        })
        .once('nodeReceivedTx', e => {
          console.log(e)
          nodeHasReceivedTx = true
        })
        .once('nodeBroadcastedTx', e => {
          console.log(e)
          nodeHasBroadcastedTx = true
        })
        .once('hostTxConfirmed', e => {
          console.log(e)
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

/*test('Should redeem 0.0005 pETH on EOS Jungle3 Testnet', async () => {
  const peth = new pERC20(configs)
  peth.setSelectedNode('https://pethoneos-node-1a.ngrok.io')
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
        .once('nodeBroadcastedTx', e => {
          nodeHasBroadcastedTx = true
        })
        .once('nativeTxConfirmed', e => {
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
})*/
