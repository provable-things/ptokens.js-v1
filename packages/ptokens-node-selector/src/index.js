import {
  createApi,
  getBootNodeApi,
  makeApiCallWithTimeout,
  NODE_CONNECTION_TIMEOUT
} from './utils/index'
import utils from 'ptokens-utils'

class NodeSelector {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, defaultNode } = configs

    if (!utils.helpers.pTokenIsValid(pToken)) throw new Error('Invalid pToken')

    this.pToken = pToken
    this.pToken.name = pToken.name.toLowerCase()
    this.pToken.redeemFrom = pToken.redeemFrom.toLowerCase()

    this.selectedNode = null
    this.nodes = []
    this.defaultNode = defaultNode
  }

  /**
   * @param {String} _endpoint
   * @param {Number} _timeout
   */
  async checkConnection(_endpoint, _timeout = NODE_CONNECTION_TIMEOUT) {
    try {
      await makeApiCallWithTimeout(
        createApi(_endpoint),
        'GET',
        `/${this.pToken.name}-on-${this.pToken.redeemFrom}/ping`,
        null,
        _timeout
      )
      return true
    } catch (err) {
      return false
    }
  }

  async getApi() {
    if (!this.selectedNode) {
      const node = await this.select()
      if (!node) throw new Error('No Nodes Available')
    }
    return this.selectedNode.api
  }

  async select() {
    try {
      if (this.nodes.length === 0) {
        const res = await makeApiCallWithTimeout(
          getBootNodeApi(),
          'GET',
          '/peers'
        )
        this.nodes = res.peers
      }

      const feature = `${this.pToken.name}-on-${this.pToken.redeemFrom}`

      if (this.defaultNode) {
        const node = this.nodes.find(
          node =>
            node.webapi === this.defaultNode && node.features.includes(feature)
        )

        if (
          node &&
          (await this.checkConnection(node.webapi, NODE_CONNECTION_TIMEOUT))
        ) {
          return this.set(node.webapi)
        }
      }

      const filteredNodesByFeature = this.nodes.filter(node =>
        node.features.includes(feature)
      )

      if (filteredNodesByFeature.length === 0)
        throw new Error('No Nodes Available')

      const nodesNotReachable = []
      for (;;) {
        const selectedNode =
          filteredNodesByFeature[
            Math.floor(Math.random() * filteredNodesByFeature.length)
          ]

        if (
          (await this.checkConnection(
            selectedNode.webapi,
            NODE_CONNECTION_TIMEOUT
          )) &&
          !nodesNotReachable.includes(selectedNode)
        ) {
          return this.set(selectedNode.webapi)
        } else if (!nodesNotReachable.includes(selectedNode)) {
          nodesNotReachable.push(selectedNode)
        }

        if (nodesNotReachable.length === filteredNodesByFeature.length)
          return null
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * @param {String} _endpoint
   */
  async set(_endpoint) {
    this.selectedNode = {
      endpoint: _endpoint,
      api: createApi(_endpoint)
    }

    return this.selectedNode
  }
}

export default NodeSelector
