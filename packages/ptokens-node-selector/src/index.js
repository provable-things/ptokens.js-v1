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
        `/${this.pToken.name}/ping`,
        null,
        _timeout
      )
      return true
    } catch (err) {
      return false
    }
  }

  async discover() {
    try {
      const res = await makeApiCallWithTimeout(
        getBootNodeApi(),
        'GET',
        '/peers'
      )
      return res.peers
    } catch (err) {
      throw new Error(err.message)
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
      try {
        await this.set(this.defaultNode)
      } catch (err) {}

      if (this.nodes.length === 0) this.nodes = await this.discover()

      const feature = `${this.pToken.name}-on-${this.pToken.redeemFrom}`
      const filteredNodesByFeature = this.nodes.filter(node =>
        node.features.includes(feature)
      )

      if (filteredNodesByFeature.length === 0) return null

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
          this.selectedNode = {
            endpoint: selectedNode.webapi,
            features: selectedNode.features,
            api: createApi(selectedNode.webapi)
          }

          return this.selectedNode
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
    if (this.nodes.length === 0) this.nodes = await this.discover()

    const feature = `${this.pToken.name}-on-${this.pToken.redeemFrom}`
    const node = this.nodes.find(
      node => node.webapi === _endpoint && node.features.includes(feature)
    )

    if (!node) throw new Error('Node not found or Wrong Feature')

    if (await !this.checkConnection(node.webapi, NODE_CONNECTION_TIMEOUT))
      throw new Error('Node Not Available')

    this.selectedNode = {
      endpoint: node.webapi,
      features: node.features,
      api: createApi(node.webapi)
    }

    return this.selectedNode
  }
}

export default NodeSelector
