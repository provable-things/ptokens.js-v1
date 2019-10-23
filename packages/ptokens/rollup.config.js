import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('Ptokens', pkg.name, {
    'ptokens-peos': 'ptokens-peos'
})