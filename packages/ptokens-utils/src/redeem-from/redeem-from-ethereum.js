import * as eth from '../eth'
import pTokenOnEth from '../abi/pTokenOnETHContractAbi.json'

const redeemFromEthereum = (_web3, _options, _params, _promiEvent, _broadcastEventName) =>
  new Promise((_resolve, _reject) => {
    eth[_options.privateKey ? 'sendSignedMethodTx' : 'makeContractSend'](
      _web3,
      'redeem',
      {
        abi: pTokenOnEth,
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

export { redeemFromEthereum }
