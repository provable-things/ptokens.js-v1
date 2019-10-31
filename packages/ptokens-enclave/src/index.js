import {
  makeApiGet,
  makeApiPost
} from './utils/index'

class Enclave {
  /**
   * @param {Function=} null - _callback
   */
  ping(_callback = null) {
    return makeApiGet('ping', _callback)
  }

  /**
   * @param {Integer} _limit
   * @param {Function=} null - _callback
   */
  getEthReport(_limit, _callback = null) {
    return makeApiGet(`/eth-reports/limit/${_limit}`, _callback)
  }

  /**
   * @param {Integer} _limit
   * @param {Function=} null - _callback
   */
  getEosReport(_limit, _callback = null) {
    return makeApiGet(`/eos-reports/limit/${_limit}`, _callback)
  }

  /**
   * @param {Function=} null - _callback
   */
  getLastProcessedEthBlock(_callback = null) {
    return makeApiGet('/last-processed-eth-block', _callback)
  }

  /**
   * @param {Function=} null - _callback
   */
  getLastProcessedEosBlock(_callback = null) {
    return makeApiGet('/last-processed-eos-block', _callback)
  }

  /**
   * @param {String} _hash
   * @param {Function=} null - _callback
   */
  getIncomingTransactionStatus(_hash, _callback = null) {
    return makeApiGet(`/incoming-tx-hash/${_hash}`, _callback)
  }

  /**
   * @param {String} _hash
   * @param {Function=} null - _callback
   */
  getBroadcastTransactionStatus(_hash, _callback = null) {
    return makeApiGet(`/broadcast-tx-hash/${_hash}`, _callback)
  }

  /**
   * @param {Object} _block
   * @param {Function=} null - _callback
   */
  submitEthBlock(_block, _callback = null) {
    return makeApiPost('/submit-eth-block', _block, _callback)
  }

  /**
   * @param {Object} _block
   * @param {Function=} null - _callback
   */
  submitEosBlock(_block, _callback = null) {
    return makeApiPost('/submit-eos-block', _block, _callback)
  }
}

export default Enclave
