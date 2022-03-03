import {
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  encodeUnsignedTransaction,
  waitForConfirmation
} from 'algosdk'
import { encode } from '@msgpack/msgpack'

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
  const tx = makeAssetTransferTxnWithSuggestedParamsFromObject({
    from,
    to,
    assetIndex: parseInt(assetIndex, 10),
    amount: parseInt(amount, 10),
    suggestedParams,
    note: encode([0, [0, 228, 177, 112], nativeAccount, []])
  })

  const signedTxs = await provider.signTxn([
    {
      txn: Buffer.from(encodeUnsignedTransaction(tx)).toString('base64')
    }
  ])

  const binarySignedTx = new Uint8Array(
    Buffer.from(signedTxs[0].blob, 'base64')
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
