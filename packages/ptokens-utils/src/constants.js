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
  Fantom,
  FantomMainnet,
  Ore,
  OreMainnet,
  Libre,
  LibreMainnet,
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
  pKEYS,
  OATH,
  pFTM,
  pWFTM,
  NUCO,
  ORE,
  pWOMBAT
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
  Algorand,
  Fantom,
  Ore,
  Libre
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
  AlgorandMainnet,
  FantomMainnet,
  OreMainnet,
  LibreMainnet
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
  },
  [Bitcoin]: {
    [BitcoinMainnet]: '0x01ec97de',
    [BitcoinTestnet]: '0x018afeb2'
  },
  [Fantom]: {
    [FantomMainnet]: '0x0022af98'
  },
  [Telos]: {
    [TelosMainnet]: '0x028c7109'
  },
  [Libre]: {
    [LibreMainnet]: '0x026776fa'
  },
  [Eosio]: {
    [EosioMainnet]: '0x02e7261c'
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
  pKEYS,
  OATH,
  pFTM,
  pWFTM,
  NUCO,
  ORE,
  pWOMBAT
}

export { blockchains, networks, pTokens, tokens, chainIds }
