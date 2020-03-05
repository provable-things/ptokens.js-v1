import { pBTC } from 'ptokens-pbtc'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc } = _configs

    if (pbtc) this.pbtc = new pBTC(pbtc)

    this.utils = utils
  }
}

export default pTokens
