import { pBTC } from 'ptokens-pbtc'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc } = _configs

    this.pbtc = !Array.isArray(pbtc)
      ? new pBTC(pbtc)
      : pbtc.map(_el => new pBTC(_el))

    this.utils = utils
  }
}

export default pTokens
