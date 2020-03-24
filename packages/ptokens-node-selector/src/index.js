import {
  createApi,
  getBootNodeApi,
  makeApiCallWithTimeout,
  NODE_CONNECTION_TIMEOUT
} from './utils/index'
import { Node } from 'ptokens-node'
import { helpers } from 'ptokens-utils'

export class NodeSelector {
  /**
   * @param {Object} configs
   */
  constructor(_configs) {
    const { pToken, defaultEndpoint } = _configs

    if (!helpers.isValidPTokenName(pToken))
      throw new Error('Invalid pToken name')

    this.pToken = pToken.toLowerCase()

    const {
      hostBlockchain,
      hostNetwork,
      nativeBlockchain,
      nativeNetwork
    } = helpers.parseParams(
      _configs,
      _configs.nativeBlockchain
        ? helpers.getBlockchainType[_configs.nativeBlockchain]
        : helpers.getNativeBlockchainFromPtokenName(this.pToken)
    )

    this.hostBlockchain = hostBlockchain
    this.hostNetwork = hostNetwork
    this.nativeBlockchain = nativeBlockchain
    this.nativeNetwork = nativeNetwork

    this.selectedNode = null
    this.nodes = []
    this.defaultEndpoint = defaultEndpoint
  }

  /**
   * @param {String} _endpoint
   * @param {Number} _timeout
   */
  async checkConnection(_endpoint, _timeout = NODE_CONNECTION_TIMEOUT) {
    try {
      const info = await makeApiCallWithTimeout(
        createApi(_endpoint),
        'GET',
        `/${this.pToken}-on-${helpers.getBlockchainShortType(
          this.hostBlockchain
        )}/get-info`,
        null,
        _timeout
      )

      // NOTE: check that the node params match
      if (
        info.host_blockchain === this.hostBlockchain &&
        info.host_network === this.hostNetwork &&
        info.native_blockchain === this.nativeBlockchain &&
        info.native_network === this.nativeNetwork
      )
        return true

      return false
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
      this.nodes = (
        await makeApiCallWithTimeout(
          getBootNodeApi(helpers.getNetworkType(this.hostNetwork)),
          'GET',
          '/peers'
        )
      ).peers

      const feature = `${this.pToken}-on-${helpers.getBlockchainShortType(
        this.hostBlockchain
      )}`

      if (this.defaultEndpoint) {
        const node = this.nodes.find(
          node =>
            node.webapi === this.defaultEndpoint &&
            node.features.includes(feature)
        )

        if (
          node &&
          (await this.checkConnection(node.webapi, NODE_CONNECTION_TIMEOUT))
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
          (await this.checkConnection(
            selectedNode.webapi,
            NODE_CONNECTION_TIMEOUT
          )) &&
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
      endpoint: _endpoint,
      blockchain: this.hostBlockchain
    })

    return this.selectedNode
  }
}
