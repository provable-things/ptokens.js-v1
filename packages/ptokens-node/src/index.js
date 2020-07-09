import { makeApiCall, REPORT_LIMIT } from './utils/index'
import polling from 'light-async-polling'
import { helpers } from 'ptokens-utils'

const NODE_POLLING_TIME = 200

export class Node {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, endpoint, appName } = configs

    if (!helpers.pTokenIsValid(pToken)) throw new Error('Invalid pToken')

    this.info = null
    this.pToken = pToken
    this.endpoint = endpoint
    this.appName = appName
  }

  ping() {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/ping`,
      null,
      this.appName
    )
  }

  async getInfo() {
    if (!this.info) {
      this.info = await makeApiCall(
        this.endpoint,
        'GET',
        `${this.pToken.name}-on-${this.pToken.redeemFrom}/get-info`,
        null,
        this.appName
      )
    }
    return this.info
  }

  /**
   * @param {String} _type
   * @param {Integer} _limit
   */
  getReports(_type, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/${_type}-reports/limit/${_limit}`,
      null,
      this.appName
    )
  }

  /**
   * @param {String} _type
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByAddress(_type, _address, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/${_type}-address/${_address}/limit/${_limit}`,
      null,
      this.appName
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _nonce
   */
  getReportByNonce(_type, _nonce) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/report/${_type}/nonce/${_nonce}`,
      null,
      this.appName
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/last-processed-${_type}-block`,
      null,
      this.appName
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/incoming-tx-hash/${_hash}`
        .null,
      this.appName
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/broadcast-tx-hash/${_hash}`,
      null,
      this.appName
    )
  }

  /**
   * @param {Object} _type
   * @param {String} _block
   */
  submitBlock(_type, _block) {
    return makeApiCall(
      this.endpoint,
      'POST',
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/submit-${_type}-block`,
      _block,
      this.appName
    )
  }

  /**
   * @param {String} _type
   * @param {String} _path
   * @param {Object} [_data = null]
   */
  generic(_type, _path, _data = null) {
    return makeApiCall(
      this.endpoint,
      _type,
      `${this.pToken.name}-on-${this.pToken.redeemFrom}/${_path}`,
      _data,
      this.appName
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
      incomingTx = await this.getIncomingTransactionStatus(_hash)

      if (incomingTx.broadcast === false && !isSeen) {
        _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        isSeen = true
        return false
      } else if (incomingTx.broadcast === true) {
        if (!isSeen) _eventEmitter.emit('onNodeReceivedTx', incomingTx)

        _eventEmitter.emit('onNodeBroadcastedTx', incomingTx)
        return true
      } else {
        return false
      }
    }, NODE_POLLING_TIME)
    return incomingTx
  }
}
