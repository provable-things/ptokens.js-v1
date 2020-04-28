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
  Mainnet,
  Testnet,
  pBTC
} from './names'

export const blockchainTypes = {
  ethereum: Ethereum,
  eth: Ethereum,
  eosio: Eosio,
  eos: Eosio,
  bitcoin: Bitcoin,
  btc: Bitcoin
}

export const blockchainShortTypes = {
  ethereum: 'eth',
  eosio: 'eos',
  bitcoin: 'btc'
}

export const pTokenNativeBlockchain = {
  pbtc: Bitcoin
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
  }
}

export const networkLabelType = {
  testnet_ropsten: Testnet,
  testnet_jungle3: Testnet,
  testnet: Testnet,
  mainnet: Mainnet
}

export const pTokensAvailables = [pBTC]
