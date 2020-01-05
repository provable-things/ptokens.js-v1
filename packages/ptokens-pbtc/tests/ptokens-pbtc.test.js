import pBTC from '../src/index'
import { expect } from 'chai'
import * as bitcoin from 'bitcoinjs-lib'
import Esplora from '../src/utils/esplora'

/* const configs = {
  ethPrivateKey: '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742',
  ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6'
} */
// corresponsing eth address = 0xdf3B180694aB22C577f7114D822D28b92cadFd75

const ETH_ADDRESS = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

const BTC_PRIVATE_KEY = '8d31f05cbb64ebb1986f64f70959b8cdcb528c2b095d617fd0bbf1e5c0f7ec07'
const BTC_ADDRESS = 'mk8aUY9DgFMx7VfDck5oQ7FjJNhn8u3snP'

jest.setTimeout(3000000)

test('Should get a BTC deposit address', async () => {
  const pbtc = new pBTC({
    btcNetwork: 'testnet'
  })

  const address = await pbtc.getDepositAddress(ETH_ADDRESS)
  expect(address)
    .to.be.a('string')
})

test('Should not get a BTC deposit address because of invalid Eth address', async () => {
  const pbtc = new pBTC({
    btcNetwork: 'testnet'
  })

  const invalidEthAddress = 'Invalid Eth Address'

  try {
    await pbtc.getDepositAddress(invalidEthAddress)
  } catch (err) {
    expect(err.message).to.be.equal('Eth Address is not valid')
  }
})

test('Should monitor an issuing of pBTC', async () => {
  const pbtc = new pBTC({
    btcNetwork: 'testnet'
  })

  const esplora = new Esplora('testnet')

  const depositAddress = await pbtc.getDepositAddress(ETH_ADDRESS)

  const key = bitcoin.ECPair.fromPrivateKey(
    Buffer.from(BTC_PRIVATE_KEY, 'hex'),
    bitcoin.networks.testnet
  )

  const utxos = await esplora.makeApiCall(
    'GET',
    `/address/${BTC_ADDRESS}/utxo`
  )

  const amountToSend = 1
  const minerFee = 1000

  // get utxo with the min value
  let min = Math.pow(2, 32)
  let utxoToSpend = null
  for (let utxo of utxos) {
    if (utxo.value < min && utxo.value > minerFee + 2 * amountToSend) {
      min = utxo.value
      utxoToSpend = utxo
    }
  }

  const utxoToSpendHex = await esplora.makeApiCall(
    'GET',
    `tx/${utxoToSpend.txid}/hex`
  )

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
  psbt.addInput({
    index: utxoToSpend.vout,
    hash: utxoToSpend.txid,
    nonWitnessUtxo: Buffer.from(
      utxoToSpendHex,
      'hex'
    )
  })

  psbt.addOutput({
    address: depositAddress,
    value: amountToSend
  })

  // NOTE: address reuse for facilitating tests
  psbt.addOutput({
    address: BTC_ADDRESS,
    value: utxoToSpend.value - minerFee - amountToSend
  })

  psbt.signInput(0, key)
  psbt.validateSignaturesOfInput(0)
  psbt.finalizeAllInputs()

  const txHexToBroadcast = psbt.extractTransaction().toHex()

  // broadcast tx
  await esplora.makeApiCall('POST', 'tx', txHexToBroadcast)

  let btcTxIsBroadcasted = false
  let btcTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      pbtc.monitorIssueByDepositAddress(depositAddress)
        .once('onBtcTxBroadcasted', () => { btcTxIsBroadcasted = true })
        .once('onBtcTxConfirmed', () => { btcTxIsConfirmed = true })
        .then(() => resolve())
    })
  await start()

  expect(btcTxIsBroadcasted).to.equal(true)
  expect(btcTxIsConfirmed).to.equal(true)
})
