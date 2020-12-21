import { getAccountName, getAmountInEosFormat } from '../eos'
import pTokenOnEosAbi from '../abi/pTokenOnEOSContractAbi.json'

const EOS_BLOCKS_BEHIND = 3
const EOS_EXPIRE_SECONDS = 60

const redeemFromEosio = async (_api, _amount, _nativeAddress, _decimals, _contractAddress, _pToken) => {
  try {
    const eosPublicKeys = await _api.signatureProvider.getAvailableKeys()
    const eosAccountName = await getAccountName(_api.rpc, eosPublicKeys)
    if (!eosAccountName) {
      // prettier-ignore
      throw new Error('Account name does not exist. Check that you entered it correctly or make sure to have enabled history plugin')
    }

    _api.cachedAbis.set(_contractAddress, {
      abi: pTokenOnEosAbi,
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
              quantity: getAmountInEosFormat(_amount, _decimals, _pToken.toUpperCase()),
              memo: _nativeAddress
            }
          }
        ]
      },
      {
        blocksBehind: EOS_BLOCKS_BEHIND,
        expireSeconds: EOS_EXPIRE_SECONDS
      }
    )
  } catch (_err) {
    throw new Error(_err.message)
  }
}

export { redeemFromEosio }
