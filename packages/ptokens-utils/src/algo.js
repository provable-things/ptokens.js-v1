import algosdk from 'algosdk'

/**
 * @param {String} _address
 */
const isValidAddress = algosdk.isValidAddress

/**
 * @param {Object} _client
 * @param {String} _txIdx
 */
const waitForTransactionConfirmation = (_client, _txIdx) => algosdk.waitForConfirmation(_client, _txIdx, 4)

export { isValidAddress, waitForTransactionConfirmation }
