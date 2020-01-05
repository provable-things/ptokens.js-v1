import axios from 'axios'
import {
  PBTC_MAINNET
} from './constants'

const BLOCKSTREAM_BASE_TESTNET_ENDPOINT = 'https://blockstream.info/testnet/api/'
const BLOCKSTREAM_BASE_MAINNET_ENDPOINT = 'https://blockstream.info/api/'

class Esplora {
  /**
   * @param {String} _network
   */
  constructor(_network) {
    const endpoint = _network === PBTC_MAINNET
      ? BLOCKSTREAM_BASE_MAINNET_ENDPOINT
      : BLOCKSTREAM_BASE_TESTNET_ENDPOINT

    this.api = axios.create({
      baseURL: endpoint,
      timeout: 50000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * @param {String} _callType
   * @param {String} _apiPath
   * @param {Object} _params
   */
  makeApiCall(_callType, _apiPath, _params = null) {
    return new Promise((resolve, reject) =>
      this.api[_callType.toLowerCase()](_apiPath, _params)
        .then(_res => resolve(_res.data))
        .catch(_err => reject(_err)))
  }
}

export default Esplora
