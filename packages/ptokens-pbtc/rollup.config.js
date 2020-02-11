import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pBTC', pkg.name, {
  'ptokens-enclave': 'ptokens-enclave',
  'ptokens-utils': 'ptokens-utils'
})
