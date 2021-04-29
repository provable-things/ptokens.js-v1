import { pBEP20 } from '../src/index'
import { expect } from 'chai'
import { constants, eth } from 'ptokens-utils'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const ETH_WEB3_PROVIDER = ''
const BSC_TESTING_ADDRESS = ''
const BSC_TESTING_PRIVATE_KEY = ''
const BSC_WEB3_PROVIDER = ''

jest.setTimeout(3000000)

let ocp = null
beforeEach(() => {
  ocp = new pBEP20({
    blockchain: constants.blockchains.Ethereum,
    network: constants.networks.Mainnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: ETH_WEB3_PROVIDER,
    bscPrivateKey: BSC_TESTING_PRIVATE_KEY,
    bscProvider: BSC_WEB3_PROVIDER,
    pToken: constants.pTokens.OCP
  })
})

test('Should not issue less than 1000000000 OCP', async () => {
  const amountToIssue = BigNumber('900000000')
  try {
    await ocp.issue(amountToIssue, ETH_TESTING_ADDRESS)
  } catch (_err) {
    expect(_err).to.be.equal('Impossible to issue less than 1000000000')
  }
})

test('Should issue 0.00002 OCP using ETH', async () => {
  const amountToIssue = BigNumber('20000000000000')
  let bscTxBroadcasted = 2
  let bscTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false

  await ocp.select()
  const { native_vault_address } = await ocp.selectedNode.getInfo()

  const web3 = new Web3(BSC_WEB3_PROVIDER)
  web3.eth.defaultAccount = ETH_TESTING_ADDRESS
  await eth.sendSignedMethodTx(
    web3,
    'approve',
    {
      privateKey: BSC_TESTING_PRIVATE_KEY,
      abi: [
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_value',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      gas: 200000,
      gasPrice: 5e9,
      contractAddress: constants.tokens['binance-smart-chain'].mainnet.OCP,
      value: 0
    },
    [eth.addHexPrefix(native_vault_address), BigNumber('20000000000000')]
  )

  const start = () =>
    new Promise(resolve => {
      ocp
        .issue(amountToIssue, ETH_TESTING_ADDRESS, {
          gasPrice: 5e9,
          gas: 200000
        })
        .once('nativeTxBroadcasted', () => {
          bscTxBroadcasted = true
        })
        .once('nativeTxConfirmed', () => {
          bscTxIsConfirmed = true
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
  expect(bscTxBroadcasted).to.equal(true)
  expect(bscTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should redeem 0.00002 OCP from BSC', async () => {
  const amountToRedeem = BigNumber('20000000000000')
  let ethTxIsBroadcasted = false
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let bscTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      ocp
        .redeem(amountToRedeem, BSC_TESTING_ADDRESS, { gasPrice: 75e9, gas: 200000 })
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
          bscTxIsConfirmed = true
        })
        .then(() => resolve())
        .catch(_err => reject(_err))
    })
  await start()
  expect(ethTxIsBroadcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(bscTxIsConfirmed).to.equal(true)
})
