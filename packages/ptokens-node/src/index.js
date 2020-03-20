import { makeApiCall, REPORT_LIMIT } from './utils/index'
import polling from 'light-async-polling'
import { helpers } from 'ptokens-utils'

const NODE_POLLING_TIME = 200

export class Node {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, endpoint } = configs

    if (!helpers.pTokenIsValid(pToken)) throw new Error('Invalid pToken')

    this.info = null
    this.pToken = pToken
    this.endpoint = endpoint
  }

  ping() {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/ping`
    )
  }

  async getInfo() {
    this.info = await makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/get-info`
    )
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
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/${_type}-reports/limit/${_limit}`
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
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/${_type}-address/${_address}/limit/${_limit}`
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
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/report/${_type}/nonce/${_nonce}`
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/last-processed-${_type}-block`
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/incoming-tx-hash/${_hash}`
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall(
      this.endpoint,
      'GET',
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/broadcast-tx-hash/${_hash}`
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
      `${this.pToken.name}-on-${this.pToken.hostBlockchain}/${_path}`,
      _data
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
