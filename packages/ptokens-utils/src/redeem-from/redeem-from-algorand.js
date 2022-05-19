import {
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  encodeUnsignedTransaction,
  waitForConfirmation
} from 'algosdk'
import { encode } from '@msgpack/msgpack'

function parseHexString(str) {
  let inStr = str
  var result = []
  while (inStr.length >= 2) {
    result.push(parseInt(inStr.substring(0, 2), 16))
    inStr = inStr.substring(2, inStr.length)
  }
  return result
}

export const redeemFromAlgorand = async ({
  amount,
  to,
  from,
  assetIndex,
  destinationChainId,
  nativeAccount,
  client,
  provider,
  eventEmitter
}) => {
  const suggestedParams = await client.getTransactionParams().do()
  const encodedDestinationChainId = parseHexString(destinationChainId.substring(2))
  const tx = makeAssetTransferTxnWithSuggestedParamsFromObject({
    from,
    to,
    assetIndex: parseInt(assetIndex, 10),
    amount: parseInt(amount, 10),
    suggestedParams,
    note: encode([0, encodedDestinationChainId, nativeAccount, []])
  })

  const signedTxs = await provider.signTxn([
    {
      txn: Buffer.from(encodeUnsignedTransaction(tx)).toString('base64')
    }
  ])

  // tx blob is contained in .blob property for algosigner
  const signedTxBlob = signedTxs[0].blob ? signedTxs[0].blob : signedTxs[0]
  const binarySignedTx = new Uint8Array(
    Buffer.from(signedTxBlob, 'base64')
      .toString('binary')
      .split('')
      .map(x => x.charCodeAt(0))
  )

  await client.sendRawTransaction(binarySignedTx).do()
  const txId = tx.txID().toString()
  eventEmitter.emit('hostTxBroadcasted', txId)
  await waitForConfirmation(client, txId, 10)
  return tx
}
