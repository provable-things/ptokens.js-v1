import axios from 'axios'

const DEFAULT_TIMEOUT = 10000
const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, Content-Type',
  'Content-Type': 'application/json'
}

export class HttpProvider {
  /**
   *
   * @param {String} _endpoint
   * @param {Object} _headers
   */
  constructor(_endpoint, _headers) {
    this.api = axios.create({
      baseURL: _endpoint,
      headers: _headers || DEFAULT_HEADERS
    })
  }

  /**
   *
   * @param {String} _callType
   * @param {String} _apiPath
   * @param {Object} _params
   * @param {Integer} _timeout
   */
  async call(_callType, _apiPath, _params = [], _timeout = DEFAULT_TIMEOUT) {
    try {
      const CancelToken = axios.CancelToken
      const options = {
        cancelToken: _timeout
          ? new CancelToken(_cancel =>
              setTimeout(
                () => _cancel(`timeout of ${_timeout}ms exceeded`),
                _timeout
              )
            )
          : undefined
      }

      const details = [
        _apiPath,
        ...(_callType === 'GET' ? [options] : [_params, options])
      ]

      const { data } = await this.api[_callType.toLowerCase()](...details)

      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
