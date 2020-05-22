import utils from '../src'
import { expect } from 'chai'
import Web3 from 'web3'
import abi from './utils/exampleContractABI.json'

const TEST_CONTRACT_ADDRESS = '0x15FA11dFB23eae46Fda69fB6A148f41677B4a090'
const TEST_ETH_PRIVATE_KEY =
  '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742'
const TEST_ETH_PROVIDER =
  'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6'
const ETH_TESTING_TX =
  '0xcbda0526ef6f74583e0af541e3e8b25542130691bddea2fdf5956c8e1ea783e5'

jest.setTimeout(60000)

test('Should return the same 0x prefixed string', () => {
  const string0xPrefixed = '0xhello'
  const expectedString0xPrefixed = '0xhello'
  const result = utils.eth.addHexPrefix(string0xPrefixed)
  expect(result).to.be.equal(expectedString0xPrefixed)
})

test('Should return the 0x prefixed string', () => {
  const stringNot0xPrefixed = 'hello'
  const expectedString0xPrefixed = '0xhello'
  const result = utils.eth.addHexPrefix(stringNot0xPrefixed)
  expect(result).to.be.equal(expectedString0xPrefixed)
})

test('Should remove the 0x prefix', () => {
  const string0xPrefixed = '0xhello'
  const expectedStringnnNot0xPrefixed = 'hello'
  const result = utils.eth.removeHexPrefix(string0xPrefixed)
  expect(result).to.be.equal(expectedStringnnNot0xPrefixed)
})

test('Should return the correct Ethereum offchain format', () => {
  const onChainAmount = 10000
  const decimals = 4
  const expectedOffChainAmount = 1
  const offChainAmount = utils.eth.correctFormat(onChainAmount, decimals, '/')
  expect(offChainAmount).to.be.equal(expectedOffChainAmount)
})

test('Should return the correct Ethereum onchain format', () => {
  const offChainAmount = 1
  const decimals = 4
  const expectedOnChainAmount = 10000
  const onChainAmount = utils.eth.correctFormat(offChainAmount, decimals, '*')
  expect(onChainAmount).to.be.equal(expectedOnChainAmount)
})

test('Should return the current Ethereum account with non injected Web3 instance', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const isWeb3Injected = false
  const expectedEthereumAccount = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
  )
  web3.eth.defaultAccount = account.address
  const ethereumAccount = await utils.eth.getAccount(web3, isWeb3Injected)
  expect(ethereumAccount).to.be.equal(expectedEthereumAccount)
})

test('Should return a valid Web3.eth.Contract instance', () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
  )
  const contract = utils.eth.getContract(
    web3,
    abi,
    TEST_CONTRACT_ADDRESS,
    account.address
  )
  const expectedContract = new web3.eth.Contract(abi, TEST_CONTRACT_ADDRESS, {
    defaultAccount: account.address
  })
  expect(JSON.stringify(contract)).to.be.equal(JSON.stringify(expectedContract))
})

test('Should return a valid gas limit', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const gasLimit = await utils.eth.getGasLimit(web3)
  expect(gasLimit).to.be.a('number')
})

test('Should return true since 0xhello is 0x prefixed', () => {
  const string0xPrefixed = '0xhello'
  const result = utils.eth.isHexPrefixed(string0xPrefixed)
  expect(result).to.be.equal(true)
})

test('Should return false since hello is not 0x prefixed', () => {
  const string0xNotPrefixed = 'hello0x'
  const result = utils.eth.isHexPrefixed(string0xNotPrefixed)
  expect(result).to.be.equal(false)
})

test('Should call an ETH contract call', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const number = await utils.eth.makeContractCall(web3, 'number', {
    isWeb3Injected: false,
    abi,
    contractAddress: TEST_CONTRACT_ADDRESS
  })
  const parsedResult = parseInt(number)
  expect(parsedResult).to.be.a('number')
})

test('Should make an ETH contract send correctly', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
  )
  web3.eth.defaultAccount = account.address
  const expectedNumber = 10

  await utils.eth.makeContractSend(
    web3,
    'setNumber',
    {
      isWeb3Injected: false,
      abi,
      contractAddress: TEST_CONTRACT_ADDRESS,
      privateKey: utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
    },
    [expectedNumber]
  )
  const number = await utils.eth.makeContractCall(web3, 'number', {
    isWeb3Injected: false,
    abi,
    contractAddress: TEST_CONTRACT_ADDRESS
  })
  expect(parseInt(number)).to.be.equal(expectedNumber)
})

test('Should make an ETH contract send correctly specifying the gas', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
  )
  web3.eth.defaultAccount = account.address
  const expectedNumber = 10

  await utils.eth.makeContractSend(
    web3,
    'setNumber',
    {
      isWeb3Injected: false,
      abi,
      gas: 30000,
      contractAddress: TEST_CONTRACT_ADDRESS,
      privateKey: utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
    },
    [expectedNumber]
  )
  const number = await utils.eth.makeContractCall(web3, 'number', {
    isWeb3Injected: false,
    abi,
    contractAddress: TEST_CONTRACT_ADDRESS
  })
  expect(parseInt(number)).to.be.equal(expectedNumber)
})

test('Should fail to send a tx because of gas limit', async () => {
  const GAS_TO_LOW = 10

  const web3 = new Web3(TEST_ETH_PROVIDER)
  const account = web3.eth.accounts.privateKeyToAccount(
    utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
  )
  web3.eth.defaultAccount = account.address

  try {
    await utils.eth.makeContractSend(
      web3,
      'setNumber',
      {
        isWeb3Injected: false,
        abi,
        gas: GAS_TO_LOW,
        contractAddress: TEST_CONTRACT_ADDRESS,
        privateKey: utils.eth.addHexPrefix(TEST_ETH_PRIVATE_KEY)
      },
      [0]
    )
  } catch (err) {
    expect(err.message).to.includes(
      'Signer Error: gas limit is too low. Need at least'
    )
  }
})

test('Should wait for an ETH transaction confirmation', async () => {
  const web3 = new Web3(TEST_ETH_PROVIDER)
  const receipt = await utils.eth.waitForTransactionConfirmation(
    web3,
    ETH_TESTING_TX,
    3000
  )
  expect(receipt).to.be.an('Object')
})
