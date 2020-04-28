import { eos } from 'ptokens-utils'
import peosAbi from '../utils/contractAbi/pBTCTokenEOSContractAbi.json'
import { EOS_BLOCKS_BEHIND, EOS_EXPIRE_SECONDS } from '../utils/constants'

const redeemFromEosio = async (
  _api,
  _amount,
  _btcAddress,
  _decimals,
  _contractAddress
) => {
  const eosPublicKeys = await _api.signatureProvider.getAvailableKeys()

  const eosAccountName = await eos.getAccountName(_api.rpc, eosPublicKeys)

  if (!eosAccountName)
    throw new Error(
      'Account name does not exist. Check that you entered it correctly or make sure to have enabled history plugin'
    )

  _api.cachedAbis.set(_contractAddress, {
    abi: peosAbi,
    rawAbi: null
  })

  return _api.transact(
    {
      actions: [
        {
          account: _contractAddress,
          name: 'redeem',
          authorization: [
            {
              actor: eosAccountName,
              permission: 'active'
            }
          ],
          data: {
            sender: eosAccountName,
            quantity: eos.getAmountInEosFormat(_amount, _decimals, 'PBTC'),
            memo: _btcAddress
          }
        }
      ]
    },
    {
      blocksBehind: EOS_BLOCKS_BEHIND,
      expireSeconds: EOS_EXPIRE_SECONDS
    }
  )
}

export { redeemFromEosio }
