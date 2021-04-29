import { getBootNodeEndpoint } from './lib/index'
import { Node } from 'ptokens-node'
import { helpers, constants } from 'ptokens-utils'
import { HttpProvider } from 'ptokens-providers'

export class NodeSelector {
  /**
   * @param {Object} configs
   */
  constructor(_configs) {
    if (_configs) this.setParams(_configs)

    this.nodes = []
    this.provider = new HttpProvider()
  }

  /**
   * @description _timeout should be within _options but in order to don't break
   *              retrocompatibility has been left where it was
   * @param {String} _endpoint
   * @param {Number} _timeout
   * @param {CheckConnectionOption} _options
   */
  async checkConnection(_endpoint, _timeout, _options = {}) {
    const {
      pToken: optionalPtoken,
      hostBlockchain: optionalHostBlockchain,
      hostNetwork: optionalHostNetwork,
      nativeBlockchain: optionalNativeBlockchain,
      nativeNetwork: optionalNativeNetwork
    } = _options
    try {
      this.provider.setEndpoint(_endpoint)
      const { host_blockchain, host_network, native_blockchain, native_network } = await this.provider.call(
        'GET',
        `/${optionalPtoken || this.pToken}-on-${helpers.getBlockchainShortType(
          optionalHostBlockchain || this.hostBlockchain
        )}/get-info`,
        null,
        _timeout
      )

      return Boolean(
        host_blockchain === (optionalHostBlockchain || this.hostBlockchain) &&
          host_network === (optionalHostNetwork || this.hostNetwork) &&
          native_blockchain === (optionalNativeBlockchain || this.nativeBlockchain) &&
          native_network === (optionalNativeNetwork || this.nativeNetwork)
      )
    } catch (_err) {
      throw new Error(`Error during checking node connection: ${_err.message}`)
    }
  }

  async getApi() {
    try {
      if (!this.selectedNode) {
        const node = await this.select()
        if (!node) throw new Error('No Nodes Available')
      }

      return this.selectedNode.api
    } catch (_err) {
      throw new Error(`Error during getting node api: ${_err.message}`)
    }
  }

  /**
   * @param {SelectOptions} _options
   */
  async select(_options = {}) {
    const {
      timeout,
      forceFetchingNodes,
      nodes: optionalNodes,
      pToken: optionalPtoken,
      hostBlockchain: optionalHostBlockchain,
      hostNetwork: optionalHostNetwork,
      nativeBlockchain: optionalNativeBlockchain,
      nativeNetwork: optionalNativeNetwork
    } = _options

    try {
      if ((this.nodes.length === 0 || forceFetchingNodes) && !optionalNodes)
        await this.fetchNodes(helpers.getNetworkType(optionalHostNetwork || this.hostNetwork))

      // prettier-ignore
      const feature = `${optionalPtoken || this.pToken}-on-${helpers.getBlockchainShortType(optionalHostBlockchain || this.hostBlockchain)}`

      const filteredNodesByFeature = optionalNodes
        ? optionalNodes.filter(({ features }) => features.includes(feature))
        : this.nodes.filter(({ features }) => features.includes(feature))
      if (filteredNodesByFeature.length === 0)
        throw new Error(`No nodes available relating to the selected pToken (${feature})`)

      const nodesNotReachable = []
      for (;;) {
        const index = Math.floor(Math.random() * filteredNodesByFeature.length)
        const selectedNode = filteredNodesByFeature[index]
        if (
          (await this.checkConnection(selectedNode.webapi, timeout || 5000, {
            pToken: optionalPtoken,
            nativeNetwork: optionalNativeNetwork,
            nativeBlockchain: optionalNativeBlockchain,
            hostNetwork: optionalHostNetwork,
            hostBlockchain: optionalHostBlockchain
          })) &&
          !nodesNotReachable.includes(selectedNode)
        ) {
          return this.setSelectedNode(selectedNode.webapi, {
            pToken: optionalPtoken,
            hostBlockchain: optionalHostBlockchain
          })
        } else if (!nodesNotReachable.includes(selectedNode)) {
          nodesNotReachable.push(selectedNode)
        }

        if (nodesNotReachable.length === filteredNodesByFeature.length)
          throw new Error(`All nodes relating to the selected pToken (${feature}) appear to be unavailable`)
      }
    } catch (_err) {
      throw new Error(_err.message)
    }
  }

  /**
   * @param {String | Node} _node
   * @param {SetSelectedNodeOptions} _options
   */
  setSelectedNode(_node, _options = {}) {
    const { pToken: optionalPtoken, hostBlockchain: optionalHostBlockchain } = _options
    if (_node instanceof Node) {
      this.selectedNode = _node
      return this.selectedNode
    }

    this.selectedNode = new Node({
      pToken: optionalPtoken || this.pToken,
      blockchain: optionalHostBlockchain || this.hostBlockchain,
      provider: new HttpProvider(_node)
    })

    return this.selectedNode
  }

  /**
   * @param {Object} configs
   */
  setParams(_configs) {
    const { defaultNode, pToken } = _configs

    if (!helpers.isValidPTokenName(pToken)) throw new Error('Invalid pToken name')

    // NOTE: pETH becomes pWETH for nodes interactions
    this.pToken = pToken.toLowerCase() === constants.pTokens.pETH ? constants.pTokens.pWETH : pToken.toLowerCase()

    const { hostBlockchain, hostNetwork, nativeBlockchain, nativeNetwork } = helpers.parseParams(
      _configs,
      _configs.nativeBlockchain
        ? helpers.getBlockchainType[_configs.nativeBlockchain]
        : helpers.getNativeBlockchainFromPtokenName(this.pToken)
    )

    this.hostBlockchain = hostBlockchain
    this.hostNetwork = hostNetwork
    this.nativeBlockchain = nativeBlockchain
    this.nativeNetwork = nativeNetwork

    this.selectedNode = defaultNode || null
  }

  /**
   * @param {String} _networkType
   */
  async fetchNodes(_networkType) {
    try {
      this.provider.setEndpoint(getBootNodeEndpoint(_networkType))
      this.nodes = (await this.provider.call('GET', '/peers')).peers
      return this.nodes
    } catch (_err) {
      throw new Error(_err.message)
    }
  }
}
