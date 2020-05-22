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
          gas: _gas,
          gasPrice: _gasPrice,
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
