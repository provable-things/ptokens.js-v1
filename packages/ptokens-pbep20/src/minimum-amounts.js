import { constants } from 'ptokens-utils'
export default {
  [constants.pTokens.OCP]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Ethereum]: 1000000000
    }
  },
  [constants.pTokens.TFF]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Polygon]: 1000000000
    }
  },
  [constants.pTokens.pSAFEMOON]: {
    issue: 1,
    redeem: {
      [constants.blockchains.Ethereum]: 1000000000
    }
  },
  [constants.pTokens.USDO]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Polygon]: 1000000000
    }
  }
}
