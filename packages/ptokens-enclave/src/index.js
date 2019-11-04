import {
  makeApiCall
} from './utils/index'

class Enclave {
  ping() {
    return makeApiCall('GET', 'ping', null)
  }

  /**
   * @param {Integer} _limit
   */
  getEthReport(_limit) {
    return makeApiCall('GET', `/eth-reports/limit/${_limit}`, null)
  }

  /**
   * @param {Integer} _limit
   */
  getEosReport(_limit) {
    return makeApiCall('GET', `/eos-reports/limit/${_limit}`, null)
  }

  getLastProcessedEthBlock() {
    return makeApiCall('GET', '/last-processed-eth-block', null)
  }

  getLastProcessedEosBlock() {
    return makeApiCall('GET', '/last-processed-eos-block', null)
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
   */
  submitEthBlock(_block) {
    return makeApiCall('POST', '/submit-eth-block', _block)
  }

  /**
   * @param {Object} _block
   * @param {Function=} null - _callback
   */
  submitEosBlock(_block) {
    return makeApiCall('POST', '/submit-eos-block', _block)
  }
}

export default Enclave
