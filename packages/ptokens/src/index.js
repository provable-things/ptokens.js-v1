import pEOS from 'ptokens-peos'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    this.peos = new pEOS(_configs)
    this.utils = utils
  }
}

export default pTokens
