import { eth } from 'ptokens-utils'
import pbtcOnEthAbi from '../utils/contractAbi/pBTCTokenETHContractAbi.json'

const redeemFromEthereum = (
  _web3,
  _amount,
  _decimals,
  _btcAddress,
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
      value: eth.zeroEther
    }

    const params = [
      eth.correctFormat(_amount, _decimals, '*').toString(),
      _btcAddress
    ]

    _hostPrivateKey
      ? eth
          .sendSignedMethodTx(
            _web3,
            'redeem',
            Object.assign({}, options, {
              privateKey: _hostPrivateKey
            }),
            params
          )
          .then(_receipt => resolve(_receipt))
          .catch(_err => reject(_err))
      : eth
          .makeContractSend(_web3, 'redeem', options, params)
          .then(_receipt => resolve(_receipt))
          .catch(_err => reject(_err))
  })

export { redeemFromEthereum }
