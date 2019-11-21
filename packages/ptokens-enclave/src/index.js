import {
  makeApiCall
} from './utils/index'

class Enclave {
  ping() {
    return makeApiCall('GET', 'ping', null)
  }

  /**
   * @param {Integer} _limit
   * @param {String} _type
   */
  getReport(_limit, _type) {
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
   * @param {Object} _block
   * @param {String} _type
   */
  submitBlock(_block, _type) {
    return makeApiCall('POST', `/submit-${_type}-block`, _block)
  }
}

export default Enclave
