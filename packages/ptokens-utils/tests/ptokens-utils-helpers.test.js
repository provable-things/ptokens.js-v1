import { expect } from 'chai'
import { parseParams } from '../src/helpers'

test('Should generate an error because it is not possible to initialize with both blockchain and hostBlockchain', async () => {
  const expectedErrorMessage = 'Bad initialization'

  try {
    parseParams(
      {
        blockchain: 'ETH',
        hostBlockchain: 'ETH',
        network: 'testnet'
      },
      'btc'
    )
  } catch (err) {
    expect(err.message).to.be.equal(expectedErrorMessage)
  }
})

test('Should generate an error because it is not possible to use both network and hostNetwork', async () => {
  const expectedErrorMessage = 'Bad initialization'

  try {
    parseParams(
      {
        blockchain: 'ETH',
        network: 'testnet',
        hostNetwork: 'testnet_ropsten'
      },
      'btc'
    )
  } catch (err) {
    expect(err.message).to.be.equal(expectedErrorMessage)
  }
})

test('Should parse with native blockchain = Bitcoin Testnet and host blockchain = Ethereum Ropsten', async () => {
  const expectedHostBlockchain = 'eth'
  const expectedHostNetwork = 'testnet_ropsten'
  const expectedNativeBlockchain = 'btc'
  const expectedNativeNetwork = 'testnet'

  const parsed = parseParams(
    {
      blockchain: 'ETH',
      network: 'testnet'
    },
    'btc'
  )

  expect(parsed.hostBlockchain).to.be.equal(expectedHostBlockchain)
  expect(parsed.hostNetwork).to.be.equal(expectedHostNetwork)
  expect(parsed.nativeBlockchain).to.be.equal(expectedNativeBlockchain)
  expect(parsed.nativeNetwork).to.be.equal(expectedNativeNetwork)
})

test('Should parse with native blockchain = Bitcoin Testnet and host blockchain = EOS Jungle2', async () => {
  const expectedHostBlockchain = 'eos'
  const expectedHostNetwork = 'testnet_jungle2'
  const expectedNativeBlockchain = 'btc'
  const expectedNativeNetwork = 'testnet'

  const parsed = parseParams(
    {
      blockchain: 'EOS',
      network: 'testnet'
    },
    'btc'
  )

  expect(parsed.hostBlockchain).to.be.equal(expectedHostBlockchain)
  expect(parsed.hostNetwork).to.be.equal(expectedHostNetwork)
  expect(parsed.nativeBlockchain).to.be.equal(expectedNativeBlockchain)
  expect(parsed.nativeNetwork).to.be.equal(expectedNativeNetwork)
})

test('Should parse with native blockchain = Bitcoin Testnet and host blockchain = EOS Jungle2 specifyng hostBlockchain and hostNetwork', async () => {
  const expectedHostBlockchain = 'eos'
  const expectedHostNetwork = 'testnet_jungle2'
  const expectedNativeBlockchain = 'btc'
  const expectedNativeNetwork = 'testnet'

  const parsed = parseParams(
    {
      hostBlockchain: 'EOS',
      hostNetwork: 'testnet_jungle2'
    },
    'btc'
  )

  expect(parsed.hostBlockchain).to.be.equal(expectedHostBlockchain)
  expect(parsed.hostNetwork).to.be.equal(expectedHostNetwork)
  expect(parsed.nativeBlockchain).to.be.equal(expectedNativeBlockchain)
  expect(parsed.nativeNetwork).to.be.equal(expectedNativeNetwork)
})

test('Should parse with native blockchain = Bitcoin Mainnet and host blockchain = Ethereum Mainnet', async () => {
  const expectedHostBlockchain = 'eth'
  const expectedHostNetwork = 'mainnet'
  const expectedNativeBlockchain = 'btc'
  const expectedNativeNetwork = 'mainnet'

  const parsed = parseParams(
    {
      blockchain: 'ETH',
      network: 'mainnet'
    },
    'btc'
  )

  expect(parsed.hostBlockchain).to.be.equal(expectedHostBlockchain)
  expect(parsed.hostNetwork).to.be.equal(expectedHostNetwork)
  expect(parsed.nativeBlockchain).to.be.equal(expectedNativeBlockchain)
  expect(parsed.nativeNetwork).to.be.equal(expectedNativeNetwork)
})
