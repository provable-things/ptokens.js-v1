import { eth } from 'ptokens-utils'
import pbtcAbi from '../utils/contractAbi/pBTCTokenETHContractAbi.json'

const redeemFromEthereum = (
  _web3,
  _amount,
  _btcAddress,
  _decimals,
  _contractAddress,
  _hostPrivateKey,
  _isWeb3injected
) =>
  new Promise((_resolve, _reject) => {
    eth
      .makeContractSend(
        _web3,
        'redeem',
        {
          isWeb3Injected: _isWeb3injected,
          abi: pbtcAbi,
          contractAddress: _contractAddress,
          privateKey: _hostPrivateKey,
          value: eth.zeroEther
        },
        [eth.correctFormat(_amount, _decimals, '*').toString(), _btcAddress]
      )
      .then(_receipt => _resolve(_receipt))
      .catch(_err => _reject(_err))
  })

export { redeemFromEthereum }
