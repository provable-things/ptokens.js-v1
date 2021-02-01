import {
  BtcUtils,
  EthUtils,
  Helpers,
  Converters,
  Constants,
  LtcUtils,
  EosUtils,
  DogeUtils
} from 'ptokens-utils'
import { pBTCConfigs } from 'ptokens-pbtc'
import { pLTCConfigs } from 'ptokens-pltc'
import { pERC20Configs } from 'ptokens-perc20'
import { pEOSTokenConfigs } from 'ptokens-peosio-token'
import { pDOGEConfigs} from 'ptokens-pdoge'
import { HttpProvider } from 'ptokens-providers'

export interface pTokensConfigs {
  pbtc?: pBTCConfigs | pBTCConfigs[],
  pltc?: pLTCConfigs | pLTCConfigs[],
  perc20?: pERC20Configs | pERC20Configs[],
  pdoge?: pDOGEConfigs | pDOGEConfigs[],
  peosToken?: pEOSTokenConfigs | pEOSTokenConfigs[] 
}

export interface Utils {
  btc: BtcUtils,
  eth: EthUtils,
  ltc: LtcUtils,
  eos: EosUtils,
  doge: DogeUtils,
  helpers: Helpers,
  converters: Converters,
  constants: Constants
}
export interface Providers {
  HttpProvider: HttpProvider
}

export class pTokens {
  constructor(_configs: pTokensConfigs)

  utils: Utils

  providers: Providers
}
