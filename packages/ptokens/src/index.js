import pEOS from 'ptokens-peos'
import Enclave from 'ptokens-enclave'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    this.peos = new pEOS(_configs)
    this.enclave = new Enclave()
    this.utils = utils
  }
}

export default pTokens
