import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pRVN', pkg.name, {
  'ptokens-deposit-address': 'ptokens-deposit-address',
  'ptokens-node-selector': 'ptokens-node-selector',
  'ptokens-node': 'ptokens-node',
  'ptokens-utils': 'ptokens-utils'
})
