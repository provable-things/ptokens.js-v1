import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pTokens', pkg.name, {
  'ptokens-pbtc': 'ptokens-pbtc',
  'ptokens-pdoge': 'ptokens-pdoge',
  'ptokens-perc20': 'ptokens-perc20',
  'ptokens-pbep20': 'ptokens-pbep20',
  'ptokens-peosio-token': 'ptokens-peosio-token',
  'ptokens-pltc': 'ptokens-pltc',
  'ptokens-prvn': 'ptokens-prvn',
  'ptokens-utils': 'ptokens-utils',
  'ptokens-providers': 'ptokens-providers',
  'ptokens-deposit-address': 'ptokens-deposit-address'
})
