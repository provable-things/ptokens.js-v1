import {
  BtcUtilsInterface,
  EthUtilsInterface,
  HelpersInterface,
  ConvertersInterface,
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
  btc: BtcUtilsInterface,
  eth: EthUtilsInterface,
  helpers: HelpersInterface,
  converters: ConvertersInterface
}

export class pTokens {
  constructor(_configs: pTokensConfigs)

  pbtc: pBTC

  utils: Utils
}
