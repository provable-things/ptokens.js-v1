import { getBootNodeEndpoint } from './lib/index'
import { Node } from 'ptokens-node'
import { helpers } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

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
    this.provider = new HttpProvider()
  }

  /**
   * @param {String} _endpoint
   * @param {Number} _timeout
   */
  async checkConnection(_endpoint, _timeout) {
    try {
      this.provider.setEndpoint(_endpoint)
      const {
        host_blockchain,
        host_network,
        native_blockchain,
        native_network
      } = await this.provider.call(
        'GET',
        `/${this.pToken}-on-${helpers.getBlockchainShortType(
          this.hostBlockchain
        )}/get-info`,
        null,
        _timeout
      )

      return host_blockchain === this.hostBlockchain &&
        host_network === this.hostNetwork &&
        native_blockchain === this.nativeBlockchain &&
        native_network === this.nativeNetwork
        ? true
        : false
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
      this.provider.setEndpoint(
        getBootNodeEndpoint(helpers.getNetworkType(this.hostNetwork))
      )
      this.nodes = (await this.provider.call('GET', '/peers')).peers

      const feature = `${this.pToken}-on-${helpers.getBlockchainShortType(
        this.hostBlockchain
      )}`

      if (this.defaultEndpoint) {
        const node = this.nodes.find(
          _node =>
            _node.webapi === this.defaultEndpoint &&
            _node.features.includes(feature)
        )

        if (node && (await this.checkConnection(node.webapi)))
          return this.setSelectedNode(node.webapi)
      }

      const filteredNodesByFeature = this.nodes.filter(node =>
        node.features.includes(feature)
      )

      if (filteredNodesByFeature.length === 0)
        throw new Error('No nodes available relating to the selected pToken')

      const nodesNotReachable = []
      for (;;) {
        const index = Math.floor(Math.random() * filteredNodesByFeature.length)
        const selectedNode = filteredNodesByFeature[index]

        if (
          (await this.checkConnection(selectedNode.webapi)) &&
          !nodesNotReachable.includes(selectedNode)
        )
          return this.setSelectedNode(selectedNode.webapi)
        else if (!nodesNotReachable.includes(selectedNode))
          nodesNotReachable.push(selectedNode)

        if (nodesNotReachable.length === filteredNodesByFeature.length) {
          throw new Error(
            'All nodes relating to the selected pToken appear to be unavailable'
          )
        }
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * @param {String | Node} _node
   */
  setSelectedNode(_node) {
    if (_node instanceof Node) {
      this.selectedNode = _node
      return this.selectedNode
    }

    this.selectedNode = new Node({
      pToken: this.pToken,
      blockchain: this.hostBlockchain,
      provider: new HttpProvider(_node)
    })

    return this.selectedNode
  }
}
