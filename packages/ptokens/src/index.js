import pEOS from 'ptokens-peos'
import pBTC from 'ptokens-pbtc'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const {
      peos,
      pbtc
    } = _configs

    if (peos)
      this.peos = new pEOS(peos)

    if (pbtc)
      this.pbtc = new pBTC(pbtc)

    this.utils = utils
  }
}

export default pTokens
