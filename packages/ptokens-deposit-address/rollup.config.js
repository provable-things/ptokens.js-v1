import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('DepositAddress', pkg.name, {
  'ptokens-utils': 'ptokens-utils',
  'ptokens-node': 'ptokens-node',
  'ptokens-providers': 'ptokens-providers',
  'ptokens-deposit-address': 'ptokens-deposit-address'
})
