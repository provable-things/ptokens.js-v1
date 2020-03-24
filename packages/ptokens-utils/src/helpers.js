export const blockchainType = {
  ethereum: 'eth',
  eth: 'eth',
  eos: 'eos',
  bitcoin: 'btc',
  btc: 'btc'
}

export const networkType = {
  eth: {
    testnet: 'testnet_ropsten',
    testnet_ropsten: 'testnet_ropsten',
    mainnet: 'mainnet'
  },
  eos: {
    testnet: 'testnet_jungle2',
    testnet_jungle2: 'testnet_jungle2'
  },
  btc: {
    testnet: 'testnet',
    mainnet: 'mainnet',
    bitcoin: 'mainnet'
  }
}

/**
 *
 * @param {Params} _params
 * @param {String} _nativeBlockchain
 */
const parseParams = (_params, _nativeBlockchain) => {
  let parsedHostBlockchain
  let parsedHostNetwork
  let parsedNativeBlockchain
  let parsedNativeNetwork

  const {
    blockchain,
    network,
    hostBlockchain,
    hostNetwork,
    nativeBlockchain,
    nativeNetwork
  } = _params

  if (
    Boolean(hostBlockchain) === Boolean(blockchain) ||
    Boolean(hostNetwork) === Boolean(network)
  ) {
    throw new Error('Bad initialization')
  }

  if (hostBlockchain) {
    parsedHostBlockchain = blockchainType[hostBlockchain.toLowerCase()]
  } else if (blockchain) {
    parsedHostBlockchain = blockchainType[blockchain.toLowerCase()]
  }

  if (!parsedHostBlockchain) throw new Error('Invalid hostBlockchain value')

  if (hostNetwork) {
    parsedHostNetwork =
      networkType[parsedHostBlockchain][hostNetwork.toLowerCase()]
  } else if (network) {
    parsedHostNetwork = networkType[parsedHostBlockchain][network.toLowerCase()]
  }

  if (!parsedHostNetwork) throw new Error('Invalid hostNetwork value')

  parsedNativeNetwork = nativeNetwork
    ? networkType[nativeNetwork.toLowerCase()]
    : null
  if (!parsedNativeNetwork && parsedHostNetwork.includes('testnet'))
    parsedNativeNetwork = 'testnet'
  else parsedNativeNetwork = 'mainnet'

  parsedNativeBlockchain = nativeBlockchain
    ? blockchainType[nativeBlockchain]
    : _nativeBlockchain

  return {
    hostBlockchain: parsedHostBlockchain,
    hostNetwork: parsedHostNetwork,
    nativeBlockchain: parsedNativeBlockchain,
    nativeNetwork: parsedNativeNetwork
  }
}

export { parseParams }
