import { Node, Report } from 'ptokens-node'

export interface NodeSelectorConfigs {
  pToken: string,
  network?: string,
  blockchain?: string,
  hostBlockchain?: string,
  hostNetwork?: string,
  nativeBlockchain?: string,
  nativeNetwork?: string
  defaultEndpoint?: string
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

  defaultEndpoint: string | null

  networkType: string

  checkConnection(_endpoint: string, _timeout?: number): Promise<boolean>

  getApi(): Promise<object>

  select(): Promise<Node>

  setEndpoint(_endpoint: string): Node
}
