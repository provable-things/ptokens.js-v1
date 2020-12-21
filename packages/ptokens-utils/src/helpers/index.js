import {
  networkLabelType,
  blockchainShortTypes,
  blockchainTypes,
  networkLabels,
  pTokenNativeBlockchain,
  pTokensAvailables
} from './maps'
import { Mainnet, Testnet } from './names'

/**
 *
 * @param {String} _network
 */
const getNetworkType = _network => networkLabelType[_network.toLowerCase()]

/**
 *
 * @param {String} _blockchain
 */
const getBlockchainType = _blockchain => blockchainTypes[_blockchain.toLowerCase()]

/**
 *
 * @param {String} _blockchain
 */
const getBlockchainShortType = _blockchain => blockchainShortTypes[_blockchain.toLowerCase()]

/**
 *
 * @param {String} _name
 */
const getNativeBlockchainFromPtokenName = _name => pTokenNativeBlockchain[_name.toLowerCase()]

/**
 *
 * @param {String} _name
 */
const isValidPTokenName = _name => Boolean(pTokensAvailables.includes(_name.toLowerCase()))

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

  const { blockchain, network, hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = _params

  if (Boolean(hostBlockchain) === Boolean(blockchain) || Boolean(hostNetwork) === Boolean(network))
    throw new Error('Bad initialization')

  if (hostBlockchain) parsedHostBlockchain = blockchainTypes[hostBlockchain.toLowerCase()]
  else if (blockchain) parsedHostBlockchain = blockchainTypes[blockchain.toLowerCase()]

  if (!parsedHostBlockchain) throw new Error('Invalid hostBlockchain value')

  if (hostNetwork) parsedHostNetwork = networkLabels[parsedHostBlockchain][hostNetwork.toLowerCase()]
  else if (network) parsedHostNetwork = networkLabels[parsedHostBlockchain][network.toLowerCase()]

  if (!parsedHostNetwork) throw new Error('Invalid hostNetwork value')

  parsedNativeNetwork = nativeNetwork ? networkLabels[nativeNetwork.toLowerCase()] : null
  if (!parsedNativeNetwork && parsedHostNetwork.includes(Testnet)) parsedNativeNetwork = Testnet
  else parsedNativeNetwork = Mainnet

  parsedNativeBlockchain = nativeBlockchain ? blockchainTypes[nativeBlockchain.toLowerCase()] : _nativeBlockchain

  return {
    hostBlockchain: parsedHostBlockchain,
    hostNetwork: parsedHostNetwork,
    nativeBlockchain: parsedNativeBlockchain,
    nativeNetwork: parsedNativeNetwork
  }
}

export {
  getNetworkType,
  getBlockchainType,
  getBlockchainShortType,
  getNativeBlockchainFromPtokenName,
  isValidPTokenName,
  parseParams
}
