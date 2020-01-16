import Esplora from '../src/lib/esplora'
import * as bitcoin from 'bitcoinjs-lib'

const esplora = new Esplora('testnet')

/**
 *
 * @param {String} _btcPrivateKey
 * @param {String} _btcAddress
 * @param {Number} _value
 * @param {Number} _minerFees
 * @param {String} _to
 */
const sendBitcoin = async (_btcPrivateKey, _btcAddress, _value, _minerFees, _to) => {
  const key = bitcoin.ECPair.fromPrivateKey(
    Buffer.from(_btcPrivateKey, 'hex'),
    bitcoin.networks.testnet
  )

  const utxos = await esplora.makeApiCall(
    'GET',
    `/address/${_btcAddress}/utxo`
  )

  // get utxo with the min value
  let min = Math.pow(2, 32)
  let utxoToSpend = null
  for (let utxo of utxos) {
    if (utxo.value < min && utxo.value > _minerFees + 2 * _value) {
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
    address: _to,
    value: _value
  })

  // NOTE: address reuse for facilitating tests
  psbt.addOutput({
    address: _btcAddress,
    value: utxoToSpend.value - _minerFees - _value
  })

  psbt.signInput(0, key)
  psbt.validateSignaturesOfInput(0)
  psbt.finalizeAllInputs()

  const txHexToBroadcast = psbt.extractTransaction().toHex()

  // broadcast tx
  return await esplora.makeApiCall('POST', 'tx', txHexToBroadcast)
}

export {
  sendBitcoin
}
