import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pTokens', pkg.name, {
    'ptokens-peos': 'ptokens-peos',
    'ptokens-enclave': 'ptokens-enclave',
    'ptokens-utils': 'ptokens-utils'
})