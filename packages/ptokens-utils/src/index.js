import * as algo from './algo'
import * as btc from './btc'
import * as doge from './doge'
import * as ltc from './ltc'
import * as converters from './converters'
import * as eth from './eth'
import * as eos from './eos'
import * as rvn from './rvn'
import * as helpers from './helpers/index'
import * as constants from './constants'
import { redeemFromEosio } from './redeem-from/redeem-from-eosio'
import { redeemFromEvmCompatible } from './redeem-from/redeem-from-evm-compatible'
import pERC20VaultContractAbi from './abi/pERC20VaultContractAbi.json'
import pERC20VaultV2ContractAbi from './abi/pERC20VaultV2ContractAbi.json'
import pTokenOnEosAbi from './abi/pTokenOnEOSContractAbi.json'
import pTokenOnEthAbi from './abi/pTokenOnETHContractAbi.json'
import EosioTokenAbi from './abi/EosioTokenAbi.json'

export default {
  abi: {
    pTokenOnEth: pTokenOnEthAbi,
    pTokenOnEos: pTokenOnEosAbi,
    pERC20Vault: pERC20VaultContractAbi,
    pERC20VaultV2: pERC20VaultV2ContractAbi,
    EosioToken: EosioTokenAbi
  },
  algo,
  btc,
  doge,
  converters,
  constants,
  eth,
  eos,
  telos: eos,
  helpers,
  ltc,
  rvn,
  redeemFrom: {
    redeemFromEvmCompatible,
    redeemFromEosio
  }
}
