import { pERC20 } from '../src/index'
import { expect } from 'chai'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import { constants, eth } from 'ptokens-utils'
import { Node } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

const ETH_TESTING_ADDRESS = ''
const ETH_TESTING_PRIVATE_KEY = ''
const WEB3_PROVIDER = ''
const ULTRA_TESTING_PRIVATE_KEY = ''
const ULTRA_TESTING_NODE_ENDPOINT = ''
const ULTRA_TESTING_ACCOUNT_NAME = ''
const PNETWORK_NODE = ''

jest.setTimeout(3000000)

let puos = null
beforeEach(() => {
  puos = new pERC20({
    pToken: constants.pTokens.pUOS,
    nativeBlockchain: constants.blockchains.Ethereum,
    nativeNetwork: constants.networks.EthereumRopsten,
    hostBlockchain: constants.blockchains.Ultra,
    hostNetwork: constants.networks.UltraTestnet,
    ethPrivateKey: ETH_TESTING_PRIVATE_KEY,
    ethProvider: WEB3_PROVIDER,
    ultraRpc: new JsonRpc(ULTRA_TESTING_NODE_ENDPOINT, { fetch }),
    ultraPrivateKey: ULTRA_TESTING_PRIVATE_KEY,
    defaultNode: new Node({
      pToken: constants.pTokens.pUOS,
      blockchain: constants.blockchains.Ultra,
      provider: new HttpProvider(PNETWORK_NODE, {
        'Access-Control-Allow-Origin': '*'
      })
    })
  })
})

test('Should issue 0.02 pULTRA', async () => {
  const amountToIssue = BigNumber('0.02').multipliedBy(10 ** 4)
  let ethTxBrodcasted = false
  let ethTxIsConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ultraTxConfirmed = false

  const { native_vault_address } = await puos.selectedNode.getInfo()

  const web3 = new Web3(WEB3_PROVIDER)
  web3.eth.defaultAccount = ETH_TESTING_ADDRESS
  await eth.sendSignedMethodTx(
    web3,
    'approve',
    {
      privateKey: ETH_TESTING_PRIVATE_KEY,
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
      gasPrice: 75e9,
      contractAddress: constants.tokens.ethereum.testnet_ropsten.UOS,
      value: 0
    },
    [eth.addHexPrefix(native_vault_address), amountToIssue]
  )

  const start = () =>
    new Promise(resolve => {
      puos
        .issue(amountToIssue, ULTRA_TESTING_ACCOUNT_NAME, {
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
          ultraTxConfirmed = true
        })
        .then(() => resolve())
    })
  await start()
  expect(ethTxBrodcasted).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ultraTxConfirmed).to.equal(true)
})

test('Should redeem 0.01 pULTRA', async () => {
  const amountToRedeem = 0.01
  let ultraTxConfirmed = false
  let nodeHasReceivedTx = false
  let nodeHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise((resolve, reject) => {
      puos
        .redeem(amountToRedeem, ETH_TESTING_ADDRESS, {
          blocksBehind: 3,
          expireSeconds: 60,
          permission: 'active',
          actor: ULTRA_TESTING_ACCOUNT_NAME
        })
        .once('hostTxConfirmed', () => {
          ultraTxConfirmed = true
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
  expect(ultraTxConfirmed).to.equal(true)
  expect(nodeHasReceivedTx).to.equal(true)
  expect(nodeHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})
