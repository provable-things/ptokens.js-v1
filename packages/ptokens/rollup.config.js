import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pTokens', pkg.name, {
  'ptokens-pbtc': 'ptokens-pbtc',
  'ptokens-erc20': 'ptokens-erc20',
  'ptokens-pltc': 'ptokens-pltc',
  'ptokens-utils': 'ptokens-utils',
  'ptokens-providers': 'ptokens-providers',
  'ptokens-deposit-address': 'ptokens-deposit-address'
})
