import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pBTC', pkg.name, {
  'ptokens-node': 'ptokens-node',
  'ptokens-utils': 'ptokens-utils'
})
