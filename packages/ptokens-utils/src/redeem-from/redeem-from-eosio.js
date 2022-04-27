import { getAmountInEosFormat } from '../eos'
import pTokenOnEosAbi from '../abi/pTokenOnEOSContractAbi.json'
import pTokenOnEosAbiV2 from '../abi/pTokenOnEOSContractAbiV2.json'

const redeemFromEosio = (_api, _amount, _nativeAddress, _decimals, _contractAddress, _pToken, _options) => {
  try {
    const { blocksBehind, expireSeconds, permission, actor, destinationChainId, version = 'v1' } = _options
    _api.cachedAbis.set(_contractAddress, {
      abi: version === 'v1' ? pTokenOnEosAbi : pTokenOnEosAbiV2,
      rawAbi: null
    })
    const data = {
      sender: actor,
      quantity: getAmountInEosFormat(_amount, _decimals, _pToken.toUpperCase()),
      memo: _nativeAddress
    }
    if (version === 'v2') {
      data.user_data = ''
      data.chain_id = destinationChainId.substring(2)
    }
    return _api.transact(
      {
        actions: [
          {
            account: _contractAddress,
            name: version === 'v1' ? 'redeem' : 'redeem2',
            authorization: [
              {
                actor,
                permission
              }
            ],
            data
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
