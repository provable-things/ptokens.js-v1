import {
  btcInterface,
  ltcInterface,
  ethInterface,
  helpersInterface,
  convertersInterface,
} from 'ptokens-utils'
import { pBTC } from 'ptokens-pbtc'
import { pLTC } from 'ptokens-pltc'

export interface pTokensConfigs {
  pbtc: {
    ethPrivateKey?: string,
    ethProvider: string | object
    btcNetwork: string
    defaultEndpoint?: string
  },
  pltc: {
    ethPrivateKey?: string,
    ethProvider: string | object
    ltcNetwork: string
    defaultEndpoint?: string
  }
}

export interface Utils {
  btc: btcInterface,
  ltc: ltcInterface,
  eth: ethInterface,
  helpers: helpersInterface,
  converters: convertersInterface
}

export class pTokens {
  constructor(_configs: pTokensConfigs)

  pbtc: pBTC

  pltc: pLTC

  utils: Utils
}
