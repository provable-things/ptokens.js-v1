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

export interface pTokensConfigs {
  pbtc: pBTCConfigs | pBTCConfigs[],
  pltc: pLTCConfigs | pLTCConfigs[]
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

export class pTokens {
  constructor(_configs: pTokensConfigs)

  pbtc: pBTCConfigs | pBTCConfigs[]

  pltc: pLTCConfigs | pLTCConfigs[]

  utils: Utils
}
