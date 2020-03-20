import {
  createApi,
  getBootNodeApi,
  makeApiCallWithTimeout,
  NODE_CONNECTION_TIMEOUT
} from './utils/index'
import { helpers } from 'ptokens-utils'
import { Node } from 'ptokens-node'

const networksToType = {
  ropsten: 'testnet',
  main: 'mainnet',
  bitcoin: 'mainnet',
  testnet: 'testnet',
  mainnet: 'mainnet'
}

export class NodeSelector {
  /**
   * @param {Object} configs
   */
  constructor(configs) {
    const { pToken, defaultEndpoint, networkType } = configs

    if (!helpers.pTokenIsValid(pToken)) throw new Error('Invalid pToken')

    this.pToken = pToken
    this.pToken.name = pToken.name.toLowerCase()
    this.pToken.redeemFrom = pToken.redeemFrom.toLowerCase()

    this.selectedNode = null
    this.nodes = []
    this.defaultEndpoint = defaultEndpoint

    if (
      networksToType[networkType] !== 'testnet' &&
      networksToType[networkType] !== 'mainnet'
    )
      throw new Error('Invalid Network Type')

    this.networkType = networkType
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
      const networkType = await this.getNetworkType()

      if (this.nodes.length === 0) {
        const res = await makeApiCallWithTimeout(
          getBootNodeApi(networkType),
          'GET',
          '/peers'
        )
        this.nodes = res.peers
      }

      const feature = `${this.pToken.name}-on-${this.pToken.redeemFrom}`

      if (this.defaultEndpoint) {
        const node = this.nodes.find(
          node =>
            node.webapi === this.defaultEndpoint &&
            node.features.includes(feature)
        )

        if (
          node &&
          await this.checkConnection(node.webapi, NODE_CONNECTION_TIMEOUT)
        )
          return this.setEndpoint(node.webapi)
      }

      const filteredNodesByFeature = this.nodes.filter(node =>
        node.features.includes(feature)
      )

      if (filteredNodesByFeature.length === 0)
        throw new Error('No Nodes Available')

      const nodesNotReachable = []
      for (;;) {
        const index = Math.floor(Math.random() * filteredNodesByFeature.length)
        const selectedNode = filteredNodesByFeature[index]

        if (
          await this.checkConnection(
            selectedNode.webapi,
            NODE_CONNECTION_TIMEOUT
          ) &&
          !nodesNotReachable.includes(selectedNode)
        )
          return this.setEndpoint(selectedNode.webapi)
        else if (!nodesNotReachable.includes(selectedNode))
          nodesNotReachable.push(selectedNode)

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
  setEndpoint(_endpoint) {
    this.selectedNode = new Node({
      pToken: this.pToken,
      endpoint: _endpoint
    })

    return this.selectedNode
  }

  async getNetworkType() {
    if (this.networkType.then) {
      const networkType = await this.networkType
      return this.setNetworkType(networkType)
    }

    return this.setNetworkType(this.networkType)
  }

  /**
   * @param {String} _type
   */
  setNetworkType(_type) {
    this.networkType = networksToType[_type]

    if (!this.networkType) throw new Error('Invalid Network Type')

    return this.networkType
  }
}
