import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc, pltc } = _configs
    if (pbtc) {
      this.pbtc = !Array.isArray(pbtc)
        ? new pBTC(pbtc)
        : pbtc.map(_el => new pBTC(_el))
    }

    if (pltc) {
      this.pltc = !Array.isArray(pltc)
        ? new pLTC(pltc)
        : pltc.map(_el => new pLTC(_el))
    }

    this.utils = utils
  }
}

export default pTokens
