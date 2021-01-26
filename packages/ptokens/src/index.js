import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'
import { pERC20 } from 'ptokens-perc20'
import { pEOSToken } from 'ptokens-peos-token'
import { pDOGE } from 'ptokens-pdoge'
import utils from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

class pTokens {
  /**
   * @param {Object} _configs
   */
  constructor(_configs) {
    const { pbtc, pltc, perc20, pdoge, peosToken } = _configs
    if (pbtc) this.pbtc = !Array.isArray(pbtc) ? new pBTC(pbtc) : pbtc.map(_el => new pBTC(_el))

    if (pltc) this.pltc = !Array.isArray(pltc) ? new pLTC(pltc) : pltc.map(_el => new pLTC(_el))

    if (pdoge) this.pdoge = !Array.isArray(pdoge) ? new pDOGE(pdoge) : pdoge.map(_el => new pDOGE(_el))

    if (perc20) {
      if (Array.isArray(perc20)) {
        perc20.forEach(_perc20 => {
          this[_perc20.pToken.toLowerCase()] = new pERC20(_perc20)
        })
      } else {
        this[perc20.pToken.toLowerCase()] = new pERC20(perc20)
      }
    }

    if (peosToken) {
      if (Array.isArray(peosToken)) {
        peosToken.forEach(_peostoken => {
          this[_peostoken.pToken.toLowerCase()] = new pEOSToken(_peostoken)
        })
      } else {
        this[peosToken.pToken.toLowerCase()] = new pEOSToken(peosToken)
      }
    }

    this.utils = utils
    this.providers = { HttpProvider }
  }
}

export default pTokens
