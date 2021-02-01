import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pEosioToken', pkg.name, {
  'ptokens-node-selector': 'ptokens-node-selector',
  'ptokens-node': 'ptokens-node',
  'ptokens-utils': 'ptokens-utils',
  'ptokens-providers': 'ptokens-providers'
})
