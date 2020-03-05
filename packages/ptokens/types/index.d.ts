import {
  btcInterface,
  ethInterface,
  helpersInterface,
  convertersInterface,
} from 'ptokens-utils'
import { pBTC } from 'ptokens-pbtc'

export interface pTokensConfigs {
  pbtc: {
    ethPrivateKey?: string,
    ethProvider: string | object
    btcNetwork: string
    defaultEndpoint?: string
  }
}

export interface Utils {
  btc: btcInterface,
  eth: ethInterface,
  helpers: helpersInterface,
  converters: convertersInterface
}

export class pTokens {
  constructor(_configs: pTokensConfigs)

  pbtc: pBTC

  utils: Utils
}
