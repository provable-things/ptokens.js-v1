import pEOS from 'ptokens-peos'
import Enclave from 'ptokens-enclave'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    this.peos = new pEOS(_configs)
    this.enclave = new Enclave()
  }
}

export default pTokens
