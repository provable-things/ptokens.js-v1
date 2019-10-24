import { api } from './utils'

class Enclave {

  /**
   * 
   * @param {Function=} null - cb
   */
  ping(cb = null) {
    return new Promise((resolve, reject) => {
      api.get('/ping')
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Integer} limit
   * @param {Function=} null - cb
   */
  getEthReport(limit = null, cb = null) {
    return new Promise((resolve, reject) => {
      api.get(`/eth-reports/limit/${limit}`)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Integer} limit
   * @param {Function=} null - cb
   */
  getEosReport(limit, cb = null) {
    return new Promise((resolve, reject) => {
      api.get(`/eos-reports/limit/${limit}`)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Function=} null - cb
   */
  getLastProcessedEthBlock(cb = null) {
    return new Promise((resolve, reject) => {
      api.get('/last-processed-eth-block')
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Function=} null - cb
   */
  getLastProcessedEosBlock(cb = null) {
    return new Promise((resolve, reject) => {
      api.get('/last-processed-eos-block')
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {String} hash
   * @param {Function=} null - cb
   */
  getIncomingTransactionStatus(hash, cb = null) {
    return new Promise((resolve, reject) => {
      api.get(`/incoming-tx-hash/${hash}`)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {String} hash
   * @param {Function=} null - cb
   */
  getBroadcastTransactionStatus(hash, cb = null) {
    return new Promise((resolve, reject) => {
      api.get(`/broadcast-tx-hash/${hash}`)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Object} block 
   * @param {Function=} cb 
   */
  submitEthBlock(block, cb = null) {
    return new Promise((resolve, reject) => {
      api.post('/submit-eth-block', block)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }

  /**
   * 
   * @param {Object} block 
   * @param {Function=} cb 
   */
  submitEosBlock(block, cb = null) {
    return new Promise((resolve, reject) => {
      api.post('/submit-eos-block', block)
      .then(r => cb 
        ? cb(r, null) 
        : resolve(r))
      .catch(e => cb 
        ? cb(null, e)
        : reject(e)
      )
    })
  }
}

export {
  Enclave
}