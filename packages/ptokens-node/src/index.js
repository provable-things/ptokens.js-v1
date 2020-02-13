import { makeApiCall, REPORT_LIMIT } from './utils/index'
import polling from 'light-async-polling'
import NodeSelector from 'ptokens-node-selector'

const NODE_POLLING_TIME = 200

const mapIncomingTxParamValue = {
  pbtc: {
    redeem: 'btc_tx_hash',
    issue: 'eth_tx_hash'
  },
  pltc: {
    redeem: 'btc_tx_hash',
    issue: 'eth_tx_hash'
  },
  peos: {
    redeem: 'broadcast_transaction_hash',
    issue: 'broadcast_transaction_hash'
  }
}

class Node extends NodeSelector {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    super(configs)

    this._info = null
  }

  ping() {
    return makeApiCall(this.getApi(), 'GET', `/${this.pToken.name}/ping`)
  }

  /**
   *
   * @param {String} _issueFromNetwork
   * @param {String} _redeemFromNetwork
   */
  async getInfo(_issueFromNetwork, _redeemFromNetwork) {
    if (!this._info) {
      const info = await makeApiCall(
        this.getApi(),
        'GET',
        `/${this.pToken.name}/get-info/${_issueFromNetwork}/${_redeemFromNetwork}`
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
      this.getApi(),
      'GET',
      `/${this.pToken.name}/${_type}-reports/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByAddress(_type, _address, _limit = REPORT_LIMIT) {
    return makeApiCall(
      this.getApi(),
      'GET',
      `${this.pToken.name}/${_type}-address/${_address}/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _nonce
   */
  getReportByNonce(_type, _nonce) {
    return makeApiCall(
      this.getApi(),
      'GET',
      `/${this.pToken.name}/report/${_type}/nonce/${_nonce}`
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return makeApiCall(
      this.getApi(),
      'GET',
      `${this.pToken.name}/last-processed-${_type}-block`
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return makeApiCall(
      this.getApi(),
      'GET',
      `${this.pToken.name}/incoming-tx-hash/${_hash}`
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return makeApiCall(
      this.getApi(),
      'GET',
      `${this.pToken.name}/broadcast-tx-hash/${_hash}`
    )
  }

  /**
   * @param {Object} _type
   * @param {String} _block
   */
  submitBlock(_type, _block) {
    return makeApiCall(
      this.getApi(),
      'POST',
      `/${this.pToken.name}/submit-${_type}-block`,
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
      this.getApi(),
      _type,
      `/${this.pToken.name}/${_path}`,
      _data
    )
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
        _eventEmitter.emit('onNodeReceivedTx', incomingTxStatus)
        isSeen = true
        return false
      } else if (incomingTxStatus.broadcast === true) {
        if (!isSeen) _eventEmitter.emit('onNodeReceivedTx', incomingTxStatus)

        broadcastedTx =
          incomingTxStatus[mapIncomingTxParamValue[this.pToken.name][_type]]
        _eventEmitter.emit('onNodeBroadcastedTx', broadcastedTx)
        return true
      } else {
        return false
      }
    }, NODE_POLLING_TIME)
    return broadcastedTx
  }
}

export default Node
