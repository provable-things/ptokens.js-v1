import { constants } from 'ptokens-utils'

const BOOT_TESTNET_ENDPOINT = 'https://testnet--bootnode-eu-1.p.network'
const BOOT_MAINNET_ENDPOINT = 'https://mainnet--bootnode-eu-1.p.network'

/**
 * @param {String} _network
 */
const getBootNodeEndpoint = _network => {
  return _network === constants.networks.Mainnet
    ? BOOT_MAINNET_ENDPOINT
    : BOOT_TESTNET_ENDPOINT
}

export { getBootNodeEndpoint }
