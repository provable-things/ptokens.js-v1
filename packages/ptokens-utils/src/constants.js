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
  Telos,
  TelosMainnet,
  Mainnet,
  Testnet,
  pBTC,
  pLTC,
  pETH,
  pWETH,
  pLINK,
  pMKR,
  pYFI,
  PNT,
  PTERIA,
  pUNI,
  pBAND,
  pBAL,
  pCOMP,
  pSNX,
  pOMG,
  pDAI,
  pANT,
  pLRC,
  pUOS,
  pBAT,
  pREP,
  pZRX,
  pPNK
} from './helpers/names'
import * as tokens from './helpers/tokens'

/**
 *
 * Blockchain used by pTokens
 */
const blockchains = {
  Bitcoin,
  Eosio,
  Ethereum,
  Litecoin,
  Telos
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
  LitecoinTestnet,
  TelosMainnet
}

/**
 *
 * pTokens list
 */
const pTokens = {
  pBTC,
  pLTC,
  pETH,
  pWETH,
  pLINK,
  pMKR,
  pYFI,
  PNT,
  PTERIA,
  pUNI,
  pBAND,
  pBAL,
  pCOMP,
  pSNX,
  pOMG,
  pDAI,
  pANT,
  pLRC,
  pUOS,
  pBAT,
  pREP,
  pZRX,
  pPNK
}

export { blockchains, networks, pTokens, tokens }
