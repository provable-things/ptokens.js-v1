import {
  makeApiCall
} from './utils/index'

class Enclave {
  /**
   * @param {Function=} null - _callback
   */
  ping(_callback = null) {
    return makeApiCall('GET', 'ping', null, _callback)
  }

  /**
   * @param {Integer} _limit
   * @param {Function=} null - _callback
   */
  getEthReport(_limit, _callback = null) {
    return makeApiCall('GET', `/eth-reports/limit/${_limit}`, null, _callback)
  }

  /**
   * @param {Integer} _limit
   * @param {Function=} null - _callback
   */
  getEosReport(_limit, _callback = null) {
    return makeApiCall('GET', `/eos-reports/limit/${_limit}`, null, _callback)
  }

  /**
   * @param {Function=} null - _callback
   */
  getLastProcessedEthBlock(_callback = null) {
    return makeApiCall('GET', '/last-processed-eth-block', null, _callback)
  }

  /**
   * @param {Function=} null - _callback
   */
  getLastProcessedEosBlock(_callback = null) {
    return makeApiCall('GET', '/last-processed-eos-block', null, _callback)
  }

  /**
   * @param {String} _hash
   * @param {Function=} null - _callback
   */
  getIncomingTransactionStatus(_hash, _callback = null) {
    return makeApiCall('GET', `/incoming-tx-hash/${_hash}`, null, _callback)
  }

  /**
   * @param {String} _hash
   * @param {Function=} null - _callback
   */
  getBroadcastTransactionStatus(_hash, _callback = null) {
    return makeApiCall('GET', `/broadcast-tx-hash/${_hash}`, null, _callback)
  }

  /**
   * @param {Object} _block
   * @param {Function=} null - _callback
   */
  submitEthBlock(_block, _callback = null) {
    return makeApiCall('POST', '/submit-eth-block', _block, _callback)
  }

  /**
   * @param {Object} _block
   * @param {Function=} null - _callback
   */
  submitEosBlock(_block, _callback = null) {
    return makeApiCall('POST', '/submit-eos-block', _block, _callback)
  }
}

export default Enclave
