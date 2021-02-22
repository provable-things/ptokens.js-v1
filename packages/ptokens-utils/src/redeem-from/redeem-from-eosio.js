import { getAccountName, getAmountInEosFormat } from '../eos'
import pTokenOnEosAbi from '../abi/pTokenOnEOSContractAbi.json'

const redeemFromEosio = async (_api, _amount, _nativeAddress, _decimals, _contractAddress, _pToken, _options) => {
  try {
    const { blocksBehind, expireSeconds, permission } = _options
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
                permission
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
        blocksBehind,
        expireSeconds
      }
    )
  } catch (_err) {
    throw new Error(_err.message)
  }
}

export { redeemFromEosio }
