import * as eth from '../eth'
import pTokenOnEth from '../abi/pTokenOnETHContractAbi.json'
import pTokenOnEthV2 from '../abi/pTokenOnETHV2ContractAbi.json'

const redeemFromEvmCompatible = (_web3, _options, _params, _promiEvent, _broadcastEventName, _version = 'v1') =>
  new Promise((_resolve, _reject) => {
    eth[_options.privateKey ? 'sendSignedMethodTx' : 'makeContractSend'](
      _web3,
      'redeem',
      {
        abi: _version === 'v1' ? pTokenOnEth : pTokenOnEthV2,
        ..._options
      },
      _params
    )
      .once('transactionHash', _hash => {
        // NOTE: 'onEthTxConfirmed' will be removed in version >= 1.0.0
        _promiEvent.eventEmitter.emit('onEthTxBroadcasted', _hash)
        _promiEvent.eventEmitter.emit(_broadcastEventName, _hash)
      })
      .once('receipt', _resolve)
      .once('error', _reject)
  })

export { redeemFromEvmCompatible }
