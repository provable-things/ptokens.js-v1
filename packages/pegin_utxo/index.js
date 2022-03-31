// import Web3 from 'web3'
// import ppp from 'ptokens'
// import ptokensUtils from 'ptokens-utils'
// const { constants } = ptokensUtils
// const { networks, blockchains, pTokens } = constants
// import settings from './src/settings/index.js'

// console.info(ppp)

// const ethProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.eth.endpoint)
// const bscProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.bsc.endpoint)

// const obj = new ppp({
//   perc20: {
//     pToken: pTokens.LUXO,
//     network: networks.BinanceSmartChainMainnet,
//     blockchain: blockchains.BinanceSmartChain,
//     ethProvider,
//     bscProvider,
//     bscPrivateKey: '12fbeff550220b802d251976915039f43b87b38cb65d0c5dc6aa92990691b6b4'
//   }
// })

// // import { HttpProvider } from 'ptokens-providers'
// // import { Node } from 'ptokens-node'
// // import ptokensUtils from 'ptokens-utils'
// // import Web3Utils from 'web3-utils'
// // const { constants } = ptokensUtils
// // import Web3 from 'web3'
// // import Web3Modal from 'web3modal'
// // import settings from './src/settings/index.js'
// // import swapAssets from './src/settings/swap-assets.js'
// // import WalletConnectProvider from '@walletconnect/web3-provider'
// // import { exit } from 'process'

// // const { networks, blockchains, pTokens } = constants
// // const ethProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.eth.endpoint)
// // const bscProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.bsc.endpoint)

// // // const web3Modal = new Web3Modal({
// // //   network: 'mainnet', // optional
// // //   cacheProvider: true, // optional
// // //   providerOptions: {
// // //     walletconnect: {
// // //       package: WalletConnectProvider,
// // //       options: {
// // //         network: 'binance',
// // //         rpc: {
// // //           56: settings.rpc.mainnet.bsc.endpoint
// // //         }
// // //       }
// // //     }
// // //     // walletlink: {
// // //     //   package: WalletLink,
// // //     //   options: {
// // //     //     appName: settings.dappName,
// // //     //     rpc: settings.rpc.mainnet.bsc.endpoint,
// // //     //     chainId: 56,
// // //     //     darkMode: getTheme() === 'dark'
// // //     //   }
// // //     // }
// // //   }
// // // })

// // // const provider = web3Modal.connect()

// // // // const web3 = new Web3(provider)
// // console.info(pTokens)
// // console.info(swapAssets)
// // console.info(swapAssets.find(({ id }) => id === 'LUXO_ON_BSC_MAINNET'))
// // const ptoken = swapAssets.find(({ id }) => id === 'LUXO_ON_BSC_MAINNET')
// // const obj = new ppp({
// //   perc20: {
// //     pToken: pTokens.LUXO,
// //     network: networks.BinanceSmartChainMainnet,
// //     blockchain: blockchains.BinanceSmartChain,
// //     ethProvider,
// //     bscProvider,
// //     bscPrivateKey: '12fbeff550220b802d251976915039f43b87b38cb65d0c5dc6aa92990691b6b4'
// //   }
// // })
// console.info(obj)
// console.info('vvvvvvv', Web3Utils.isAddress('0xc8D59c57B8C58Eac1622C7A639E10bF8B1E3DF9D'))
// try {
//   console.info('eeeeeeeeeee', obj.luxo.redeem)
//   obj.luxo.redeem(0.000000000000005 * 10 ** ptoken.decimals, '0xc8D59c57B8C58Eac1622C7A639E10bF8B1E3DF9D')
// } catch (err) {
//   console.info('eeeeee', err)
// }

import ppp from 'ptokens'
// import { HttpProvider } from 'ptokens-providers'
// import { Node } from 'ptokens-node'
import ptokensUtils from 'ptokens-utils'
import Web3Utils from 'web3-utils'
const { constants } = ptokensUtils
import Web3 from 'web3'
import settings from './src/settings/index.js'
import swapAssets from './src/settings/swap-assets.js'

const { networks, blockchains, pTokens } = constants
const ethProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.eth.endpoint)
const bscProvider = new Web3.providers.HttpProvider(settings.rpc.mainnet.bsc.endpoint)

// const web3Modal = new Web3Modal({
//   network: 'mainnet', // optional
//   cacheProvider: true, // optional
//   providerOptions: {
//     walletconnect: {
//       package: WalletConnectProvider,
//       options: {
//         network: 'binance',
//         rpc: {
//           56: settings.rpc.mainnet.bsc.endpoint
//         }
//       }
//     }
//     // walletlink: {
//     //   package: WalletLink,
//     //   options: {
//     //     appName: settings.dappName,
//     //     rpc: settings.rpc.mainnet.bsc.endpoint,
//     //     chainId: 56,
//     //     darkMode: getTheme() === 'dark'
//     //   }
//     // }
//   }
// })

// const provider = web3Modal.connect()

// // const web3 = new Web3(provider)
console.info(pTokens)
console.info(swapAssets)
console.info(swapAssets.find(({ id }) => id === 'PLBC_ON_BSC_MAINNET'))
const ptoken = swapAssets.find(({ id }) => id === 'PLBC_ON_BSC_MAINNET')

console.info(ppp)


const ptok = new ppp({
  pbtc: {
    pToken: pTokens.pLBC,
    nativeBlockchain: blockchains.Lbry,
    nativeNetwork: networks.Mainnet,
    hostBlockchain: blockchains.BinanceSmartChain,
    hostNetwork: networks.Mainnet,
    ethProvider: bscProvider
  }
})
console.info(ptok)
const deposit_address = await ptok[ptoken.workingName].getDepositAddress('0xc8D59c57B8C58Eac1622C7A639E10bF8B1E3DF9D')

console.info('deposit', deposit_address.toString())
console.info('vvvvvvv', Web3Utils.isAddress('0xc8D59c57B8C58Eac1622C7A639E10bF8B1E3DF9D'))
// try {
//   console.info('eeeeeeeeeee', pbtc.luxo.redeem)
//   obj.luxo.redeem(0.000000000000005 * 10 ** ptoken.decimals, '0xc8D59c57B8C58Eac1622C7A639E10bF8B1E3DF9D', {gas:200000})
// } catch (err) {
//   console.info('eeeeee', err)
// }
