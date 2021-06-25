import { getAmountInEosFormat } from '../eos'
import pTokenOnEosAbi from '../abi/pTokenOnEOSContractAbi.json'

const redeemFromEosio = (_api, _amount, _nativeAddress, _decimals, _contractAddress, _pToken, _options) => {
  try {
    const { blocksBehind, expireSeconds, permission, actor } = _options
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
                actor,
                permission
              }
            ],
            data: {
              sender: actor,
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
