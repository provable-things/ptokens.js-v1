import * as bitcoin from 'bitcoinjs-lib'
import utils from 'ptokens-utils'

/**
 * @param {String} _ltcPrivateKey
 * @param {String} _ltcAddress
 * @param {Number} _value
 * @param {Number} _minerFees
 * @param {String} _to
 */
const sendLitecoin = async (_ltcPrivateKey, _ltcAddress, _value, _minerFees, _to) => {
  const key = bitcoin.ECPair.fromPrivateKey(Buffer.from(_ltcPrivateKey, 'hex'), bitcoin.networks.testnet)

  const utxos = await utils.ltc.getUtxoByAddress('testnet', _ltcAddress)

  // get utxo with the min value
  let min = Math.pow(2, 32)
  let utxoToSpend = null
  for (let utxo of utxos) {
    if (utxo.satoshis < min && utxo.satoshis > _minerFees + 2 * _value) {
      min = utxo.satoshis
      utxoToSpend = utxo
    }
  }

  const utxoToSpendHex = await utils.ltc.getTransactionHexById('testnet', utxoToSpend.txid)

  bitcoin.networks.litecoinTestnet = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xb0
  }

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.litecoinTestnet })
  psbt.addInput({
    index: utxoToSpend.vout,
    hash: utxoToSpend.txid,
    nonWitnessUtxo: Buffer.from(utxoToSpendHex.rawtx, 'hex')
  })

  psbt.addOutput({
    address: _to,
    value: _value
  })

  // NOTE: address reuse for facilitating tests
  psbt.addOutput({
    address: _ltcAddress,
    value: utxoToSpend.satoshis - _minerFees - _value
  })

  psbt.signInput(0, key)
  psbt.validateSignaturesOfInput(0)
  psbt.finalizeAllInputs()

  const txHexToBroadcast = psbt.extractTransaction().toHex()

  return utils.ltc.broadcastTransaction('testnet', txHexToBroadcast)
}

export { sendLitecoin }
