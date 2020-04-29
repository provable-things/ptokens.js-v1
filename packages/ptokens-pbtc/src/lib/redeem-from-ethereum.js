import { eth } from 'ptokens-utils'
import pbtcOnEthAbi from '../utils/contractAbi/pBTCTokenETHContractAbi.json'

const redeemFromEthereum = (
  _web3,
  _amount,
  _btcAddress,
  _decimals,
  _contractAddress,
  _hostPrivateKey,
  _isWeb3injected
) =>
  new Promise((resolve, reject) => {
    eth
      .makeContractSend(
        _web3,
        'redeem',
        {
          isWeb3Injected: _isWeb3injected,
          abi: pbtcOnEthAbi,
          contractAddress: _contractAddress,
          privateKey: _hostPrivateKey,
          value: eth.zeroEther
        },
        [eth.correctFormat(_amount, _decimals, '*').toString(), _btcAddress]
      )
      .then(_receipt => resolve(_receipt))
      .catch(_err => reject(_err))
  })

export { redeemFromEthereum }
