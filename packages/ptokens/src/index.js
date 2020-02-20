import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import utils from 'ptokens-utils'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc, pltc } = _configs

    if (pbtc) this.pbtc = new pBTC(pbtc)

    if (pltc) this.pltc = new pLTC(pltc)

    this.utils = utils
  }
}

export default pTokens
