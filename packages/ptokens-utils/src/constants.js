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
  PolygonMainnet,
  Xdai,
  XdaiMainnet,
  Ravencoin,
  RavencoinMainnet,
  Lbry,
  LbryMainnet,
  Ultra,
  UltraMainnet,
  UltraTestnet,
  Arbitrum,
  ArbitrumMainnet,
  Luxochain,
  LuxochainMainnet,
  Algorand,
  AlgorandMainnet,
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
  pEOS,
  IQ,
  TLOS,
  pOPIUM,
  pBCP,
  pDEFIPlusPlus,
  CGG,
  pUSDT,
  pUSDC,
  pRVN,
  pOPEN,
  OCP,
  ANRX,
  TFF,
  pSAFEMOON,
  EFX,
  pSEEDS,
  pLBC,
  USDO,
  GALA,
  ZMT,
  BIST,
  pVAI,
  WSB,
  LUXO,
  pTET,
  pKEYS
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
  Polygon,
  Xdai,
  Ravencoin,
  Lbry,
  Ultra,
  Arbitrum,
  Luxochain,
  Algorand
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
  PolygonMainnet,
  XdaiMainnet,
  RavencoinMainnet,
  LbryMainnet,
  UltraMainnet,
  UltraTestnet,
  ArbitrumMainnet,
  LuxochainMainnet,
  AlgorandMainnet
}

const chainIds = {
  [Ethereum]: {
    [EthereumMainnet]: '0x005fe7f9',
    [EthereumRopsten]: '0x0069c322'
  },
  [Arbitrum]: {
    [ArbitrumMainnet]: '0x00ce98c4'
  },
  [Luxochain]: {
    [LuxochainMainnet]: '0x00d5beb0'
  },
  [BinanceSmartChain]: {
    [BinanceSmartChainMainnet]: '0x00e4b170'
  },
  [Algorand]: {
    [AlgorandMainnet]: '0x03c38e67'
  }
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
  pEOS,
  IQ,
  TLOS,
  pOPIUM,
  pBCP,
  pDEFIPlusPlus,
  CGG,
  pUSDT,
  pUSDC,
  pRVN,
  pOPEN,
  OCP,
  ANRX,
  TFF,
  pSAFEMOON,
  EFX,
  pSEEDS,
  pLBC,
  USDO,
  GALA,
  ZMT,
  BIST,
  pVAI,
  WSB,
  LUXO,
  pTET,
  pKEYS
}

export { blockchains, networks, pTokens, tokens, chainIds }
