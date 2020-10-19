import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pBTC', pkg.name, {
  'ptokens-node-selector': 'ptokens-node-selector',
  'ptokens-node': 'ptokens-node',
  'ptokens-utils': 'ptokens-utils',
  'ptokens-deposit-address': 'ptokens-deposit-address',
  'ptokens-providers': 'ptokens-providers'
})
