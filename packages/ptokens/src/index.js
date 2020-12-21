import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import { pERC20 } from 'ptokens-perc20'
import utils from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc, pltc, perc20 } = _configs
    if (pbtc) {
      this.pbtc = !Array.isArray(pbtc) ? new pBTC(pbtc) : pbtc.map(_el => new pBTC(_el))
    }

    if (pltc) {
      this.pltc = !Array.isArray(pltc) ? new pLTC(pltc) : pltc.map(_el => new pLTC(_el))
    }

    if (perc20) {
      if (Array.isArray(perc20)) {
        perc20.forEach(_perc20 => {
          this[_perc20.pToken.toLowerCase()] = new pERC20(_perc20)
        })
      } else {
        this[perc20.pToken.toLowerCase()] = new pERC20(perc20)
      }
    }

    this.utils = utils
    this.providers = { HttpProvider }
  }
}

export default pTokens
