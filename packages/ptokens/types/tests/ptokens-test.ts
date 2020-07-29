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
  }]
})

// $ExpectType pBTCConfigs | pBTCConfigs[]
ptokens.pbtc

// $ExpectType pLTCConfigs | pLTCConfigs[]
ptokens.pltc

// $ExpectType Utils
ptokens.utils
