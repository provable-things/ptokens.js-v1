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
  Dogecoin,
  DogecoinMainnet,
  BinanceSmartChain,
  BinanceSmartChainMainnet,
  Polygon,
  MaticMainnet,
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
  pPNK,
  pDOGE,
  pEOS
} from './helpers/names'
import tokens from './helpers/tokens'

/**
 *
 * Blockchain used by pTokens
 */
const blockchains = {
  Bitcoin,
  Eosio,
  Ethereum,
  Litecoin,
  Telos,
  Dogecoin,
  BinanceSmartChain,
  Polygon
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
  TelosMainnet,
  DogecoinMainnet,
  BinanceSmartChainMainnet,
  MaticMainnet
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
  pPNK,
  pDOGE,
  pEOS
}

export { blockchains, networks, pTokens, tokens }
