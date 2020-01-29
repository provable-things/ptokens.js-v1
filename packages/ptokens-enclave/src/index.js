import { getApi, makeApiCall, REPORT_LIMIT } from './utils/index'
import utils from 'ptokens-utils'
import polling from 'light-async-polling'

const ENCLAVE_POLLING_TIME = 200

const mapIncomingTxParamValue = {
  pbtc: {
    redeem: 'btc_tx_hash',
    issue: 'eth_tx_hash'
  },
  peos: {
    redeem: 'broadcast_transaction_hash',
    issue: 'broadcast_transaction_hash'
  }
}

class Enclave {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken } = configs

    if (!utils.helpers.pTokenNameIsValid(pToken))
      throw new Error('Invalid pToken')

    this.pToken = utils.helpers.pTokenNameNormalized(pToken)
    this._api = getApi(this.pToken)
    this._info = null
  }

  ping() {
    return makeApiCall(this._api, 'GET', `/${this.pToken}/ping`)
  }

  /**
   *
   * @param {String} _issueFromNetwork
   * @param {String} _redeemFromNetwork
   */
  async getInfo(_issueFromNetwork, _redeemFromNetwork) {
    if (!this._info) {
      const info = await makeApiCall(
        this._api,
        'GET',
        `/${this.pToken}/get-info/${_issueFromNetwork}/${_redeemFromNetwork}`
      )
      this._info = info
    }
    return this._info
  }

  /**
   * @param {String} _type
   * @param {Integer} _limit
   */
  getReports(_type, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this._api,
      'GET',
      `/${this.pToken}/${_type}-reports/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByAddress(_type, _address, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this._api,
      'GET',
      `${this.pToken}/${_type}-address/${_address}/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _nonce
   */
  getReportByNonce(_type, _nonce) {
    return makeApiCall(
      this._api,
      'GET',
      `/${this.pToken}/report/${_type}/nonce/${_nonce}`
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall(
      this._api,
      'GET',
      `${this.pToken}/last-processed-${_type}-block`
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall(
      this._api,
      'GET',
      `${this.pToken}/incoming-tx-hash/${_hash}`
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall(
      this._api,
      'GET',
      `${this.pToken}/broadcast-tx-hash/${_hash}`
    )
  }

  /**
   * @param {Object} _type
   * @param {String} _block
   */
  submitBlock(_type, _block) {
    return makeApiCall(
      this._api,
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
    return makeApiCall(this._api, _type, `/${this.pToken}/${_path}`, _data)
  }

  /**
   * @param {String} _transaction
   * @param {String} __type
   * @param {EventEmitter} _eventEmitter
   */
  async monitorIncomingTransaction(_transaction, _type, _eventEmitter) {
    let broadcastedTx = null
    let isSeen = false
    await polling(async () => {
      const incomingTxStatus = await this.getIncomingTransactionStatus(
        _transaction
      )
      if (incomingTxStatus.broadcast === false && !isSeen) {
        _eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)
        isSeen = true
        return false
      } else if (incomingTxStatus.broadcast === true) {
        if (!isSeen) _eventEmitter.emit('onEnclaveReceivedTx', incomingTxStatus)

        broadcastedTx =
          incomingTxStatus[mapIncomingTxParamValue[this.pToken][_type]]
        _eventEmitter.emit('onEnclaveBroadcastedTx', broadcastedTx)
        return true
      } else {
        return false
      }
    }, ENCLAVE_POLLING_TIME)
    return broadcastedTx
  }
}

export default Enclave
