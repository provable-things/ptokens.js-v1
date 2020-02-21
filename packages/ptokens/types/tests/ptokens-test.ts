import { pTokens } from 'ptokens'

// $ExpectType pTokens
const ptokens = new pTokens({
  pbtc: {
    ethPrivateKey:
      '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider:
      'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    btcNetwork: 'bitcoin'
  },
  pltc: {
    ethPrivateKey:
      '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider:
      'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    ltcNetwork: 'litecoin'
  }
})

// $ExpectType pBTC
ptokens.pbtc

// $ExpectType pLTC
ptokens.pltc

// $ExpectType Utils
ptokens.utils
