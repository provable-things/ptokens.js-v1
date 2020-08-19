import {
  onChainFormat,
  sendSignedMethodTx,
  makeContractSend,
  zeroEther
} from '../eth'
import pbtcOnEthAbi from '../abi/pTokenOnETHContractAbi.json'
import BigNumber from 'bignumber.js'

const redeemFromEthereum = (
  _web3,
  _amount,
  _decimals,
  _nativeAddress,
  _contractAddress,
  _gas,
  _gasPrice,
  _hostPrivateKey
) =>
  new Promise((resolve, reject) => {
    const options = {
      abi: pbtcOnEthAbi,
      gas: _gas,
      gasPrice: _gasPrice,
      contractAddress: _contractAddress,
      value: zeroEther
    }

    const params = [
      onChainFormat(new BigNumber(_amount), _decimals).toFixed(),
      _nativeAddress
    ]

    _hostPrivateKey
      ? sendSignedMethodTx(
          _web3,
          'redeem',
          Object.assign({}, options, {
            privateKey: _hostPrivateKey
          }),
          params
        )
          .then(_receipt => resolve(_receipt))
          .catch(_err => reject(_err))
      : makeContractSend(_web3, 'redeem', options, params)
          .then(_receipt => resolve(_receipt))
          .catch(_err => reject(_err))
  })

export { redeemFromEthereum }
