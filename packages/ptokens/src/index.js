import { pEOS } from 'ptokens-peos'
import { Enclave } from 'ptokens-enclave'

class pTokens {
  constructor (configs) {
    this.peos = new pEOS(configs)
    this.enclave = new Enclave()
  }
}

export default pTokens
