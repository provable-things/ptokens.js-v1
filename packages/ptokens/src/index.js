import { pEOS } from 'ptokens-peos'
import { Enclave } from 'ptokens-enclave'

class pTokens {
  constructor (configs, web3 = null) {
    this.peos = new pEOS(configs, web3)
    this.enclave = new Enclave()
  }
}

export default pTokens