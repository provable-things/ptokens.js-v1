import * as btc from './btc'
import * as ltc from './ltc'
import * as converters from './converters'
import * as eth from './eth'
import * as eos from './eos'
import * as helpers from './helpers/index'
import * as constants from './constants'
import { redeemFromEosio } from './redeem-from/redeem-from-eosio'
import { redeemFromEthereum } from './redeem-from/redeem-from-ethereum'
import pERC20VaultContractAbi from './abi/pERC20VaultContractAbi.json'
import pTokenOnEosAbi from './abi/pTokenOnEOSContractAbi.json'
import pTokenOnEthAbi from './abi/pTokenOnETHContractAbi.json'

export default {
  abi: {
    pTokenOnEth: pTokenOnEthAbi,
    pTokenOnEos: pTokenOnEosAbi,
    pERC20Vault: pERC20VaultContractAbi
  },
  btc,
  converters,
  constants,
  eth,
  eos,
  telos: eos,
  helpers,
  ltc,
  redeemFrom: {
    redeemFromEthereum,
    redeemFromEosio
  }
}
