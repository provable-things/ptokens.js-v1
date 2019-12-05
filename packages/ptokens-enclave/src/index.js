import {
  makeApiCall,
  REPORT_LIMIT
} from './utils/index'

class Enclave {
  ping() {
    return makeApiCall('GET', 'ping', null)
  }

  /**
   * @param {Integer} _limit
   * @param {String} _type
   */
  getReport(_type, _limit = REPORT_LIMIT) {
    return makeApiCall('GET', `/${_type}-reports/limit/${_limit}`, null)
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall('GET', `/last-processed-${_type}-block`, null)
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall('GET', `/incoming-tx-hash/${_hash}`, null)
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall('GET', `/broadcast-tx-hash/${_hash}`, null)
  }

  /**
   * @param {Object} _type
   * @param {String} _block
   */
  submitBlock(_type, _block) {
    return makeApiCall('POST', `/submit-${_type}-block`, _block)
  }
}

export default Enclave
