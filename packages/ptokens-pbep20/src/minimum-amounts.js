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
    issue: 1e16,
    redeem: {
      [constants.blockchains.Ethereum]: 1e16
    }
  },
  [constants.pTokens.USDO]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Polygon]: 1000000000
    }
  },
  [constants.pTokens.pVAI]: {
    issue: 1000000000000000,
    redeem: {
      [constants.blockchains.Ethereum]: 1000000000000000
    }
  },
  [constants.pTokens.WSB]: {
    issue: 1000000000000000,
    redeem: {
      [constants.blockchains.Ethereum]: 1000000000000000
    }
  },
  [constants.pTokens.pTET]: {
    issue: 0,
    redeem: {
      [constants.blockchains.Algorand]: 0
    }
  }
}
