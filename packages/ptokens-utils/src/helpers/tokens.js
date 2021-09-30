import {
  EthereumMainnet,
  EthereumRopsten,
  EosioMainnet,
  Ethereum,
  Eosio,
  Telos,
  TelosMainnet,
  BinanceSmartChain,
  BinanceSmartChainMainnet
} from './names'

export default {
  [Ethereum]: {
    [EthereumMainnet]: {
      ETH: '0x0000000000000000000000000000000000000000',
      WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      PNT: '0x89ab32156e46f46d02ade3fecbe5fc4243b9aaed',
      MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
      YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      PTERIA: '0x02eca910cb3a7d43ebc7e8028652ed5c6b70259b',
      UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      BAND: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
      BAL: '0xba100000625a3754423978a60c9317c58a424e3d',
      COMP: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      SNX: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      OMG: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
      DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
      ANT: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
      LRC: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
      UOS: '0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c',
      BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      REP: '0x221657776846890989a759ba2973e427dff5c9bb',
      ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      PNK: '0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d',
      OPIUM: '0x888888888889c00c67689029d7856aac1065ec11',
      BCP: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
      'DEFI++': '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
      CGG: '0x1fe24f25b1cf609b9c4e7e12d802e3640dfa5e43',
      USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      OPEN: '0x69e8b9528cabda89fe846c67675b5d73d463a916',
      ANRX: '0xcae72a7a0fd9046cf6b165ca54c9e3a3872109e0',
      GALA: '0x15d4c048f83bd7e37d49ea4c83a07267ec4203da',
      ZMT: '0xaa602dE53347579f86b996D2Add74bb6F79462b2'
    },
    [EthereumRopsten]: {
      UOS: '0x92829bc1a5b405fe14a0b7c38a5bad9a91b1dc02'
    }
  },
  [BinanceSmartChain]: {
    [BinanceSmartChainMainnet]: {
      OCP: '0x3c70260eee0a2bfc4b375feb810325801f289fbd',
      TFF: '0x2d69c55baecefc6ec815239da0a985747b50db6e',
      SAFEMOON: '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3',
      USDO: '0x5801d0e1c7d977d78e4890880b8e579eb4943276'
    }
  },
  [Eosio]: {
    [EosioMainnet]: {
      EOS: 'eosio.token',
      IQ: 'everipediaiq',
      EFX: 'effecttokens'
    }
  },
  [Telos]: {
    [TelosMainnet]: {
      TLOS: 'eosio.token',
      SEEDS: 'token.seeds'
    }
  }
}
