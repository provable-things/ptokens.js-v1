import { constants } from 'ptokens-utils'
export default {
  [constants.tokens['binance-smart-chain'].mainnet.OCP]: {
    issue: 1000000000,
    redeem: {
      [constants.blockchains.Ethereum]: 0.000000001
    }
  }
}
