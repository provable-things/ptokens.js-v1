const { pERC20 } = require('./dist/ptokens-perc20.cjs')
const ERC20Abi = require('./ERC20.json')
const Web3 = require('web3')

const PHOENIX_DESTINATION_ACCOUNT = 'phoenix-account'
const ETHEREUM_ADDRESS = 'ethereum-address'
const ETHEREUM_PRIVATE_KEY = 'ethereum-private-key'
const AMOUNT = 1.0
const PHOENIX_ACTIVE_PRIVATE_KEY = 'phoenix-active-private-key'

async function setAllowance(amount) {
  console.info('setAllowance', amount)
  const nativeVaultAddress = '0xe396757ec7e6ac7c8e5abe7285dde47b98f22db8'
  const web3 = new Web3('https://cloudflare-eth.com/')
  const toApprove = new web3.eth.Contract(ERC20Abi, '0xdac17f958d2ee523a2206206994597c13d831ec7')
  const allowance = await toApprove.methods.allowance(ETHEREUM_ADDRESS, nativeVaultAddress).call()
  console.info('allowance', allowance)
  if (allowance < amount) {
    console.info('needs to set')
    const _approve = _amount =>
      toApprove.methods.approve(nativeVaultAddress, _amount).send({ from: ETHEREUM_ADDRESS, gas: 75000 })
    if (allowance > 0) await _approve(0)
    await _approve(amount)
  }
}

const perc20 = new pERC20({
  pToken: 'pUSDT',
  nativeBlockchain: 'ethereum',
  nativeNetwork: 'mainnet',
  hostBlockchain: 'phoenix',
  hostNetwork: 'mainnet',
  ethProvider: 'https://cloudflare-eth.com/',
  ethPrivateKey: ETHEREUM_PRIVATE_KEY,
  eosRpc: 'http://libre.eosusa.io',
  eosPrivateKey: PHOENIX_ACTIVE_PRIVATE_KEY
})

async function pegin(_destAddress) {
  await setAllowance(AMOUNT * 10 ** 6)
  await perc20
    .issueWithMetadata(AMOUNT * 10 ** 6, PHOENIX_DESTINATION_ACCOUNT, '0xc0ffee', { gas: 100000, gasPrice: 85e9 })
    .once('nativeTxBroadcasted', _tx => {
      console.info('nativeTxBroadcasted', _tx)
    })
    .once('nativeTxConfirmed', () => {
      console.info('nativeTxConfirmed')
    })
    .once('nodeReceivedTx', () => {
      console.info('nodeReceivedTx')
    })
    .once('nodeBroadcastedTx', _report => {
      console.info('nodeBroadcastedTx', _report.broadcast_tx_hash)
    })
    .once('hostTxConfirmed', _receipt => {
      console.info('hostTxConfirmed', _receipt.id)
    })
    .then(_result => {
      console.info('end of swap!')
    })
    .catch(_err => {
      console.error(_err)
    })
}

function pegout(_amount, _ethAddress) {
  perc20
    .redeem(_amount, _ethAddress, {
      blocksBehind: 3,
      expireSeconds: 30,
      permission: 'active',
      actor: PHOENIX_DESTINATION_ACCOUNT
    })
    .once('hostTxConfirmed', _receipt => {
      console.info('hostTxConfirmed', _receipt.transaction_id)
    })
    .once('nodeReceivedTx', () => {
      console.info('nodeReceivedTx')
    })
    .once('nodeBroadcastedTx', _tx => {
      console.info('nodeBroadcastedTx', _tx.broadcast_tx_hash)
    })
    .once('nativeTxConfirmed', _receipt => {
      console.info('nativeTxConfirmed', _receipt.transactionHash)
    })
    .then(_result => {
      console.info('end of swap!')
    })
    .catch(_err => {
      console.error(_err)
    })
}

pegin(PHOENIX_DESTINATION_ACCOUNT)

pegout(AMOUNT, ETHEREUM_ADDRESS)
