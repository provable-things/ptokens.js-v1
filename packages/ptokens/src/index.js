import pEOS from 'ptokens-peos'
import Enclave from 'ptokens-enclave'

class pTokens {
  constructor(_configs, _web3 = null) {
    this.peos = new pEOS(_configs, _web3)
    this.enclave = new Enclave()
  }
}

export default pTokens
