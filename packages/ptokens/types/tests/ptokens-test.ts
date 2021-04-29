import { pTokens } from 'ptokens'

// $ExpectType pTokens
const ptokens = new pTokens({
  pbtc: [{
    network: 'mainnet',
    blockchain: 'eth'
  }],
  pltc: [{
    network: 'mainnet',
    blockchain: 'eth'
  }],
  prvn: [{
    network: 'mainnet',
    blockchain: 'bsc'
  }]
})

// $ExpectType Utils
ptokens.utils
