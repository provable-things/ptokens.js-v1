import {
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  waitForConfirmation,
  getApplicationAddress,
  makeApplicationCallTxnFromObject,
  encodeUint64,
  decodeAddress,
  assignGroupID
} from 'algosdk'
import { encode } from '@msgpack/msgpack'

function encodeStringForArgs(str) {
  return new Uint8Array(Buffer.from(str))
}

function parseHexString(str) {
  let inStr = str
  var result = []
  while (inStr.length >= 2) {
    result.push(parseInt(inStr.substring(0, 2), 16))
    inStr = inStr.substring(2, inStr.length)
  }
  return result
}

const decodeBlob = _blob =>
  new Uint8Array(
    Buffer.from(_blob, 'base64')
      .toString('binary')
      .split('')
      .map(x => x.charCodeAt(0))
  )

export const redeemFromAlgorand = async ({
  amount,
  to,
  from,
  assetIndex,
  destinationChainId,
  nativeAccount,
  client,
  provider,
  eventEmitter,
  swapInfo
}) => {
  const suggestedParams = await client.getTransactionParams().do()
  const encodedDestinationChainId = parseHexString(destinationChainId.substring(2))
  const asaTransferTx = makeAssetTransferTxnWithSuggestedParamsFromObject({
    from,
    to: swapInfo ? getApplicationAddress(parseInt(swapInfo.appId)) : to,
    assetIndex: parseInt(swapInfo ? swapInfo.inputAssetId : assetIndex),
    amount: parseInt(amount, 10),
    suggestedParams,
    note: encode([0, encodedDestinationChainId, nativeAccount, []])
  })

  let appCallTx
  if (swapInfo) {
    appCallTx = makeApplicationCallTxnFromObject({
      from,
      suggestedParams,
      appIndex: parseInt(swapInfo.appId),
      appArgs: [encodeStringForArgs('swap'), encodeUint64(parseInt(assetIndex, 10)), decodeAddress(to).publicKey],
      foreignAssets: [parseInt(assetIndex), parseInt(swapInfo.inputAssetId)],
      accounts: [to]
    })
    assignGroupID([asaTransferTx, appCallTx])
  } else {
    assignGroupID([asaTransferTx])
  }

  const toBeSignedTxs = [asaTransferTx]
  if (swapInfo) toBeSignedTxs.push(appCallTx)
  const signedTxs = await provider.signTxn(toBeSignedTxs)

  // tx blob is contained in .blob property for algosigner
  const binaryAsaTransferSignedTx = decodeBlob(signedTxs[0].blob ? signedTxs[0].blob : signedTxs[0])
  let binarySignedTxs = [binaryAsaTransferSignedTx]
  if (swapInfo) binarySignedTxs.push(decodeBlob(signedTxs[1].blob ? signedTxs[1].blob : signedTxs[1]))

  await client.sendRawTransaction(binarySignedTxs).do()
  eventEmitter.emit('hostTxBroadcasted', asaTransferTx.group.toString('base64'))
  await waitForConfirmation(client, asaTransferTx.txID(), 10)
  return swapInfo ? appCallTx : asaTransferTx
}
