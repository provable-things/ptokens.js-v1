import { makeJsonRpcSafeCall, REPORT_LIMIT } from './utils/index'
import polling from 'light-async-polling'
import { helpers } from 'ptokens-utils'

const NODE_POLLING_TIME = 200

export class Node {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, blockchain, endpoint } = configs

    if (!helpers.isValidPTokenName(pToken))
      throw new Error('Invalid pToken name')

    this.pToken = pToken.toLowerCase()
    this.blockchain = helpers.getBlockchainShortType(blockchain)
    this.endpoint = endpoint
  }

  ping() {
    return makeJsonRpcSafeCall(this.endpoint, 'POST', '/', 'node_ping')
  }

  peers() {
    return makeJsonRpcSafeCall(this.endpoint, 'POST', '/', 'node_peers')
  }

  getInfo() {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_getInfo'
    )
  }

  /**
   *
   * @param {Integer} _limit
   */
  getNativeReports(_limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryNativeReports',
      [_limit]
    )
  }

  /**
   *
   * @param {Integer} _limit
   */
  getHostReports(_limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryHostReports',
      [_limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsBySenderAddress(_address, _limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_querySender',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByRecipientAddress(_address, _limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryRecipient',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByNativeAddress(_address, _limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryNativeAddress',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByHostAddress(_address, _limit = REPORT_LIMIT) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryHostAddress',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _hash
   */
  getReportByIncomingTxHash(_hash) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryIncomingTxHash',
      [_hash]
    )
  }

  /**
   *
   * @param {String} _hash
   */
  getReportByBroadcastTxHash(_hash) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_queryBroadcastTxHash',
      [_hash]
    )
  }

  /**
   *
   * @param {String} _address
   */
  getNativeDepositAddress(_address) {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_getNativeDepositAddress',
      [_address]
    )
  }

  getDepositAddresses() {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_getDepositAddressArray'
    )
  }

  getLastProcessedNativeBlock() {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_getLastProcessedNativeBlock'
    )
  }

  getLastProcessedHostBlock() {
    return makeJsonRpcSafeCall(
      this.endpoint,
      'POST',
      `${this.pToken}-on-${this.blockchain}/v1`,
      'app_getLastProcessedHostBlock'
    )
  }

  /**
   * @param {String} _hash
   * @param {EventEmitter} _eventEmitter
   */
  async monitorIncomingTransaction(_hash, _eventEmitter) {
    let incomingTx = null
    let isSeen = false
    await polling(async () => {
      incomingTx = await this.getReportByIncomingTxHash(_hash)

      if (incomingTx.broadcast === false && !isSeen) {
        _eventEmitter.emit('nodeReceivedTx', incomingTx)
        _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        isSeen = true
        return false
      } else if (incomingTx.broadcast === true) {
        if (!isSeen) {
          _eventEmitter.emit('nodeReceivedTx', incomingTx)
          _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        }

        _eventEmitter.emit('nodeBroadcastedTx', incomingTx)
        _eventEmitter.emit('onNodeBroadcastedTx', incomingTx)
        return true
      } else {
        return false
      }
    }, NODE_POLLING_TIME)
    return incomingTx
  }
}
