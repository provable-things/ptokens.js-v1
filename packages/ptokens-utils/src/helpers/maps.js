import {
  Bitcoin,
  BitcoinMainnet,
  BitcoinTestnet,
  Litecoin,
  LitecoinTestnet,
  LitecoinMainnet,
  Ethereum,
  EthereumMainnet,
  EthereumRopsten,
  Eosio,
  EosioMainnet,
  EosioJungle3,
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
  Mainnet,
  Testnet,
  pBTC,
  pLTC,
  pWETH,
  pETH,
  pYFI,
  PNT,
  pLINK,
  pMKR,
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
  pUSDC,
  pUSDT,
  pRVN
} from './names'

export const blockchainTypes = {
  ethereum: Ethereum,
  eth: Ethereum,
  eosio: Eosio,
  eos: Eosio,
  bitcoin: Bitcoin,
  btc: Bitcoin,
  ltc: Litecoin,
  litecoin: Litecoin,
  telos: Telos,
  dogecoin: Dogecoin,
  doge: Dogecoin,
  'binance-smart-chain': BinanceSmartChain,
  bsc: BinanceSmartChain,
  matic: Polygon,
  polygon: Polygon,
  xdai: Xdai,
  ravencoin: Ravencoin,
  rvn: Ravencoin
}

export const blockchainShortTypes = {
  ethereum: 'eth',
  eosio: 'eos',
  bitcoin: 'btc',
  litecoin: 'ltc',
  telos: 'telos',
  dogecoin: 'doge',
  'binance-smart-chain': 'bsc',
  matic: 'polygon',
  polygon: 'polygon',
  xdai: 'xdai',
  ravencoin: 'rvn'
}

export const pTokenNativeBlockchain = {
  pbtc: Bitcoin,
  pltc: Litecoin,
  pweth: Ethereum,
  peth: Ethereum,
  plink: Ethereum,
  pyfi: Ethereum,
  pmkr: Ethereum,
  pnt: Ethereum,
  pteria: Ethereum,
  puni: Ethereum,
  pband: Ethereum,
  pbal: Ethereum,
  pcomp: Ethereum,
  psnx: Ethereum,
  pomg: Ethereum,
  pdai: Ethereum,
  pant: Ethereum,
  plrc: Ethereum,
  puos: Ethereum,
  pbat: Ethereum,
  prep: Ethereum,
  pzrx: Ethereum,
  ppnk: Ethereum,
  pdoge: Dogecoin,
  peos: Eosio,
  iq: Eosio,
  tlos: Telos,
  popium: Ethereum,
  pbcp: Ethereum,
  pdefiplusplus: Ethereum,
  cgg: Ethereum,
  pusdc: Ethereum,
  pusdt: Ethereum,
  prvn: Ravencoin
}

export const networkLabels = {
  ethereum: {
    testnet: EthereumRopsten,
    testnet_ropsten: EthereumRopsten,
    mainnet: EthereumMainnet
  },
  eosio: {
    testnet: EosioJungle3,
    testnet_jungle3: EosioJungle3,
    mainnet: EosioMainnet
  },
  bitcoin: {
    testnet: Bitcoin,
    mainnet: BitcoinMainnet,
    bitcoin: BitcoinTestnet
  },
  litecoin: {
    testnet: LitecoinTestnet,
    mainnet: LitecoinMainnet,
    litecoin: LitecoinMainnet
  },
  telos: {
    mainnet: TelosMainnet
  },
  dogecoin: {
    mainnet: DogecoinMainnet,
    dogecoin: DogecoinMainnet
  },
  'binance-smart-chain': {
    mainnet: BinanceSmartChainMainnet
  },
  polygon: {
    mainnet: PolygonMainnet
  },
  matic: {
    mainnet: PolygonMainnet
  },
  xdai: {
    mainnet: XdaiMainnet
  },
  ravencoin: {
    mainnet: RavencoinMainnet,
    ravencoin: RavencoinMainnet
  }
}

export const networkLabelType = {
  testnet_ropsten: Testnet,
  testnet_jungle3: Testnet,
  testnet: Testnet,
  mainnet: Mainnet
}

export const pTokensAvailables = [
  pBTC,
  pLTC,
  pWETH,
  pETH,
  pYFI,
  pMKR,
  PNT,
  pLINK,
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
  pRVN
]
