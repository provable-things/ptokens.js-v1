import {
  BtcUtils,
  EthUtils,
  Helpers,
  Converters,
  Constants,
  LtcUtils,
  EosUtils
} from 'ptokens-utils'
import { pBTC, pBTCConfigs } from 'ptokens-pbtc'
import { pLTC, pLTCConfigs } from 'ptokens-pltc'
import { pERC20, pERC20Configs } from 'ptokens-perc20'
import { HttpProvider } from 'ptokens-providers'

export interface pTokensConfigs {
  pbtc?: pBTCConfigs | pBTCConfigs[],
  pltc?: pLTCConfigs | pLTCConfigs[],
  pweth?: pERC20Configs | pERC20Configs[],
  peth?: pERC20Configs | pERC20Configs[],
}

export interface Utils {
  btc: BtcUtils,
  eth: EthUtils,
  ltc: LtcUtils,
  eos: EosUtils,
  helpers: Helpers,
  converters: Converters,
  constants: Constants
}
export interface Providers {
  HttpProvider: HttpProvider
}

export class pTokens {
  constructor(_configs: pTokensConfigs)

  pbtc: pBTCConfigs | pBTCConfigs[]

  pltc: pLTCConfigs | pLTCConfigs[]

  pweth: pERC20Configs | pERC20Configs[]

  peth: pERC20Configs | pERC20Configs[]

  utils: Utils

  providers: Providers
}
