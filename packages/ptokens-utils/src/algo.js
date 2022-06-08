import algosdk from 'algosdk'

/**
 * @param {String} _address
 */
function isValidAddress(str, allowAppId = false) {
  // check if appId
  if (allowAppId && parseInt(str)) return true
  return algosdk.isValidAddress(str)
}

/**
 * @param {Object} _client
 * @param {String} _txIdx
 */
const waitForTransactionConfirmation = (_client, _txIdx) => algosdk.waitForConfirmation(_client, _txIdx, 4)

export { isValidAddress, waitForTransactionConfirmation }
