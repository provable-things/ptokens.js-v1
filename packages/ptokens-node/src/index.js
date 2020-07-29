import polling from 'light-async-polling'
import { helpers } from 'ptokens-utils'

const NODE_POLLING_TIME = 200
const REPORT_LIMIT = 100

export class Node {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, blockchain, provider } = configs

    if (!helpers.isValidPTokenName(pToken))
      throw new Error('Invalid pToken name')

    this.pToken = pToken.toLowerCase()
    this.blockchain = helpers.getBlockchainShortType(blockchain)
    this.provider = provider
  }

  ping() {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/ping`
    )
  }

  getInfo() {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/get-info`
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _limit
   */
  getReports(_type, _limit = REPORT_LIMIT) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/${_type}-reports/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByAddress(_type, _address, _limit = REPORT_LIMIT) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/${_type}-address/${_address}/limit/${_limit}`
    )
  }

  /**
   * @param {String} _type
   * @param {Integer} _nonce
   */
  getReportByNonce(_type, _nonce) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/report/${_type}/nonce/${_nonce}`
    )
  }

  /**
   * @param {String} _type
   */
  getLastProcessedBlock(_type) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/last-processed-${_type}-block`
    )
  }

  /**
   * @param {String} _hash
   */
  getIncomingTransactionStatus(_hash) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/incoming-tx-hash/${_hash}`
    )
  }

  /**
   * @param {String} _hash
   */
  getBroadcastTransactionStatus(_hash) {
    return this.provider.call(
      'GET',
      `${this.pToken}-on-${this.blockchain}/broadcast-tx-hash/${_hash}`
    )
  }

  /**
   * @param {String} _type
   * @param {String} _path
   * @param {Object} [_data = null]
   */
  generic(_type, _path, _data = null) {
    return this.provider.call(
      _type,
      `${this.pToken}-on-${this.blockchain}/${_path}`,
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
        _eventEmitter.emit('nodeReceivedTx', incomingTx)
        _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        isSeen = true
        return false
      } else if (incomingTx.broadcast === true) {
        if (!isSeen) {
          _eventEmitter.emit('nodeReceivedTx', incomingTx)
          _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        }

        _eventEmitter.emit('nodeBroadcastedTx', incomingTx)
        _eventEmitter.emit('onNodeBroadcastedTx', incomingTx)
        return true
      } else {
        return false
      }
    }, NODE_POLLING_TIME)
    return incomingTx
  }
}
