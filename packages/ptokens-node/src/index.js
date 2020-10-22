import polling from 'light-async-polling'
import { helpers } from 'ptokens-utils'
import jsonrpc from 'jsonrpc-lite'
import { v4 as uuidv4 } from 'uuid'

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
    this.version = 'v1'
  }

  ping() {
    return this._makeJsonRpcCall(`/${this.version}`, 'node_ping')
  }

  getPeers() {
    return this._makeJsonRpcCall(`/${this.version}`, 'node_peers')
  }

  getInfo() {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_getInfo'
    )
  }

  /**
   *
   * @param {Integer} _limit
   */
  getNativeReports(_limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryNativeReports',
      [_limit]
    )
  }

  /**
   *
   * @param {Integer} _limit
   */
  getHostReports(_limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryHostReports',
      [_limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsBySenderAddress(_address, _limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_querySender',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByRecipientAddress(_address, _limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryRecipient',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByNativeAddress(_address, _limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryNativeAddress',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _address
   * @param {Integer} _limit
   */
  getReportsByHostAddress(_address, _limit = REPORT_LIMIT) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryHostAddress',
      [_address, _limit]
    )
  }

  /**
   *
   * @param {String} _hash
   */
  getReportByIncomingTxHash(_hash) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryIncomingTxHash',
      [_hash]
    )
  }

  /**
   *
   * @param {String} _hash
   */
  getReportByBroadcastTxHash(_hash) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_queryBroadcastTxHash',
      [_hash]
    )
  }

  /**
   *
   * @param {String} _address
   */
  getNativeDepositAddress(_address) {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_getNativeDepositAddress',
      [_address]
    )
  }

  getDepositAddresses() {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_getDepositAddressArray'
    )
  }

  getLastProcessedNativeBlock() {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_getLastProcessedNativeBlock'
    )
  }

  getLastProcessedHostBlock() {
    return this._makeJsonRpcCall(
      `${this.version}/${this.pToken}-on-${this.blockchain}`,
      'app_getLastProcessedHostBlock'
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
      incomingTx = await this.getReportByIncomingTxHash(_hash)

      if (incomingTx && incomingTx.broadcast === false && !isSeen) {
        _eventEmitter.emit('nodeReceivedTx', incomingTx)
        _eventEmitter.emit('onNodeReceivedTx', incomingTx)
        isSeen = true
        return false
      } else if (incomingTx && incomingTx.broadcast === true) {
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

  async _makeJsonRpcCall(_path, _call, _body = []) {
    try {
      const { result } = await this.provider.call(
        'POST',
        _path,
        jsonrpc.request(uuidv4(), _call, _body)
      )
      return result
    } catch (_err) {
      throw new Error(_err.message)
    }
  }
}
