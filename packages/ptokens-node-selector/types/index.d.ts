import { Node, Report } from 'ptokens-node'
import { HttpProvider } from 'ptokens-providers'

export interface NodeSelectorConfigs {
  pToken: string,
  network?: string,
  blockchain?: string,
  hostBlockchain?: string,
  hostNetwork?: string,
  nativeBlockchain?: string,
  nativeNetwork?: string,
  defaultNode?: Node,
}

export interface NodeList extends Array<Node> {}

export class NodeSelector {
  constructor(_configs: NodeSelectorConfigs)

  hostBlockchain: string

  hostNetwork: string

  nativeBlockchain: string

  nativeNetwork: string

  selectedNode: Node

  nodes: NodeList

  networkType: string

  provider: HttpProvider | null

  checkConnection(_endpoint: string, _timeout?: number): Promise<boolean>

  getApi(): Promise<object>

  select(): Promise<Node>

  setSelectedNode(_endpoint: string | Node): Node
}
