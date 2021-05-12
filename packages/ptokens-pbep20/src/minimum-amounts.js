import { constants } from 'ptokens-utils'
export default {
  [constants.tokens['binance-smart-chain'].mainnet.OCP]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Ethereum]: 1000000000
    }
  },
  [constants.tokens['binance-smart-chain'].mainnet.TFF]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Polygon]: 1000000000
    }
  }
}
