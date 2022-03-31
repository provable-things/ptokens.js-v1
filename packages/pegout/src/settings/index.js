const settings = {
  dappName: 'pTokens Dapp',
  googleAnalyticsTrackId: 'UA-157173999-1',
  portisDappId: '522ff2fb-0934-4252-912b-a549a388a574',
  fortmaticKey: 'pk_live_D0A703008A4B17B7',
  links: {
    audit: 'https://github.com/cryptonicsconsulting/audits/tree/master/pToken',
    stats: 'https://pnetwork.watch/',
    coinmarketcap: 'https://coinmarketcap.com/currencies/pnetwork/',
    twitter: 'https://twitter.com/pNetworkDeFi',
    telegram: 'https://t.me/pNetworkDefi'
  },
  api: {
    bpm: 'https://chart.ptokens.io/index.php?a=bpm'
  },
  supportedBlockchains: [
    {
      name: 'Ethereum',
      symbol: 'ETH'
    },
    {
      name: 'Binance Smart Chain',
      symbol: 'BSC'
    },
    {
      name: 'EOS',
      symbol: 'EOS'
    },
    {
      name: 'Polygon',
      symbol: 'POLYGON'
    },
    {
      name: 'Telos',
      symbol: 'TELOS'
    },
    {
      name: 'xDai',
      symbol: 'XDAI'
    },
    {
      name: 'Ultra',
      symbol: 'ULTRA'
    },
    {
      name: 'Arbitrum',
      symbol: 'ARBITRUM'
    },
    {
      name: 'Luxochain',
      symbol: 'LUXOCHAIN'
    },
    {
      name: 'Algorand',
      symbol: 'ALGORAND'
    }
  ],
  rpc: {
    mainnet: {
      eth: {
        wsEndpoint: 'wss://dapp-eth-node-1.ptokens.io/',
        endpoint: 'https://eth-mainnet.alchemyapi.io/v2/EKy2BQvt7RzS36bSdpcwMCGzYz_TNL7n'
      },
      eos: {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        host: 'eos.greymass.com',
        port: 443,
        protocol: 'https',
        endpoint: 'https://corsproxy.ptokens.io/v1/?apiurl=https://eos.greymass.com'
      },
      telos: {
        chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        host: 'telos.greymass.com',
        port: 443,
        protocol: 'https',
        endpoint: 'https://corsproxy.ptokens.io/v1/?apiurl=https://telos.greymass.com'
      },
      bsc: {
        endpoint: 'https://twilight-white-surf.bsc.quiknode.pro/fc906dd4db4c2dd8e60dbe922ed44bdcbec96d9f/'
      },
      xdai: {
        endpoint: 'https://rpc.xdaichain.com/'
      },
      polygon: {
        endpoint: 'https://winter-black-glade.matic.quiknode.pro/fe20ff1b7e2de5d54fa983e34ccbd23c942401d0/'
      },
      ultra: {
        chainId: 'a9c481dfbc7d9506dc7e87e9a137c931b0a9303f64fd7a1d08b8230133920097',
        host: 'https://corsproxy.ptokens.io/v1/?apiurl=http://ultra-mainnet-1.ptokens.io:8888',
        port: 443,
        protocol: 'https',
        endpoint: 'https://corsproxy.ptokens.io/v1/?apiurl=http://ultra-mainnet-1.ptokens.io:8888'
      },
      arbitrum: {
        endpoint: 'https://arb1.arbitrum.io/rpc'
      },
      luxochain: {
        endpoint: 'https://corsproxy.ptokens.io/v1/?apiurl=https://lugano.nodes.luxochain.io'
      },
      algorand: {
        token: '4950dcab89ddc2e7f4dd8e51deb2f0c44aa37aab18cbfd8242ac5fb697222342',
        port: 443,
        endpoint: 'https://algorand-node-1.ptokens.io'
      }
    }
  },
  explorers: {
    mainnet: {
      eth: 'https://etherscan.io/',
      btc: 'https://blockstream.info/',
      eos: 'https://bloks.io/',
      telos: 'https://telos.bloks.io/',
      ltc: 'https://live.blockcypher.com/ltc/',
      bsc: 'https://bscscan.com/',
      xdai: 'https://blockscout.com/poa/xdai/',
      polygon: 'https://polygonscan.com/',
      doge: 'https://dogechain.info/',
      rvn: 'https://ravencoin.network/',
      lbc: 'https://explorer.lbry.com/',
      ultra: 'https://explorer.mainnet.ultra.io/',
      arbitrum: 'https://arbiscan.io/',
      luxochain: 'https://explorer.luxochain.io/',
      algorand: 'https://algoexplorer.io/'
    }
  },
  supportedNfts: [
    {
      symbol: 'RAREBIT',
      name: 'Rarebit Bunnies'
    },
    {
      symbol: 'CGT',
      name: 'ChainGuardians'
    }
  ],
  swapOldPntOnBsc: {
    swapContractAddress: '0x66e75D37a6fa02Fd385f94476901f95c205EfC61',
    asset: {
      address: '0x7a1da9f49224ef98389b071b8a3294d1cc5e3e6a',
      id: 'PNT_ON_BSC_MAINNET_OLD',
      name: 'PNT',
      workingName: 'pnt',
      nativeDecimals: 18,
      blockchain: 'BSC',
      decimals: 18,
      withMiniImage: true,
      symbol: 'PNT',
      nativeSymbol: 'PNT',
      image: 'PNT_gray.svg',
      withBalanceDecimalsConversion: true
    }
  }
}

export default settings
