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

// $ExpectType pERC20Configs | pERC20Configs[]
ptokens.pweth

// $ExpectType pERC20Configs | pERC20Configs[]
ptokens.peth

// $ExpectType Utils
ptokens.utils
