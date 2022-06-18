import { constants } from 'ptokens-utils'

const { blockchains, networks, pTokens } = constants

export default {
  [pTokens.pDAI]: {
    [blockchains.Eosio]: {
      [networks.EosioMainnet]: 4
    }
  },
  [pTokens.pUOS]: {
    [blockchains.Eosio]: {
      [networks.EosioMainnet]: 4
    },
    [blockchains.Ultra]: {
      [networks.UltraTestnet]: 8
    }
  },
  [pTokens.pUSDT]: {
    [blockchains.Telos]: {
      [networks.TelosMainnet]: 6
    },
    [blockchains.Libre]: {
      [networks.LibreMainnet]: 9
    }
  },
  [pTokens.pUSDC]: {
    [blockchains.Telos]: {
      [networks.TelosMainnet]: 6
    }
  }
}
