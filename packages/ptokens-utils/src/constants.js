import {
  Bitcoin,
  BitcoinMainnet,
  BitcoinTestnet,
  Ethereum,
  EthereumMainnet,
  EthereumRopsten,
  Eosio,
  EosioMainnet,
  EosioJungle3,
  Litecoin,
  LitecoinMainnet,
  LitecoinTestnet,
  Mainnet,
  Testnet,
  pBTC,
  pLTC
} from './helpers/names'

/**
 *
 * Blockchain used by pTokens
 */
const blockchains = {
  Bitcoin,
  Eosio,
  Ethereum,
  Litecoin
}

/**
 *
 * Networks compatible with pTokens
 */
const networks = {
  Mainnet,
  Testnet,
  BitcoinMainnet,
  BitcoinTestnet,
  EthereumMainnet,
  EthereumRopsten,
  EosioMainnet,
  EosioJungle3,
  LitecoinMainnet,
  LitecoinTestnet
}

/**
 *
 * pTokens list
 */
const pTokens = {
  pBTC,
  pLTC
}

export { blockchains, networks, pTokens }
