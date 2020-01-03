import {
  getApi,
  makeApiCall,
  REPORT_LIMIT
} from './utils/index'
import utils from 'ptokens-utils'

class Enclave {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const {
      pToken
    } = configs

    if (!utils.helpers.pTokenNameIsValid(pToken))
      throw new Error('Invalid pToken')

    this.pToken = utils.helpers.pTokenNameNormalized(pToken)
    this.api = getApi(this.pToken)
  }

  ping() {
    return makeApiCall(
      this.api,
      'GET',
      `/${this.pToken}/ping`,
      null
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _limit
   */
  getReports(_type, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this.api,
      'GET', `/${this.pToken}/${_type}-reports/limit/${_limit}`,
      null
    )
  }

  /**
   * @param {String} _type
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByAddress(_type, _address, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this.api,
      'GET',
      `${this.pToken}/${_type}-address/${_address}/limit/${_limit}`,
      null
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _nonce
   */
  getReportByNonce(_type, _nonce) {
    return makeApiCall(
      this.api,
      'GET',
      `/${this.pToken}/report/${_type}/nonce/${_nonce}`,
      null
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall(
      this.api,
      'GET',
      `${this.pToken}/last-processed-${_type}-block`,
      null
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall(
      this.api,
      'GET',
      `${this.pToken}/incoming-tx-hash/${_hash}`,
      null
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall(
      this.api,
      'GET',
      `${this.pToken}/broadcast-tx-hash/${_hash}`,
      null
    )
  }

  /**
   * @param {Object} _type
   * @param {String} _block
   */
  submitBlock(_type, _block) {
    return makeApiCall(
      this.api,
      'POST',
      `/${this.pToken}/submit-${_type}-block`,
      _block
    )
  }

  /**
   * @param {String} _type
   * @param {String} _path
   * @param {Object} [_data = null]
   */
  generic(_type, _path, _data = null) {
    return makeApiCall(
      this.api,
      _type,
      `/${this.pToken}/${_path}`,
      _data
    )
  }
}

export default Enclave
