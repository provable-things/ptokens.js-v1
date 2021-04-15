import { Node } from 'ptokens-node'
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

export interface SelectOptions {
  forceFetchingNodes?: boolean,
  nodes?: object[],
  pToken: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  hostNetwork?: string,
  hostBlockchain?: string
}

export interface CheckConnectionOption {
  pToken: string,
  nativeNetwork?: string,
  nativeBlockchain?: string,
  hostNetwork?: string,
  hostBlockchain?: string
}

export interface SetSelectedNodeOptions {
  pToken: string,
  hostBlockchain?: string
}

export class NodeSelector {
  constructor(_configs: NodeSelectorConfigs)

  hostBlockchain: string

  hostNetwork: string

  nativeBlockchain: string

  nativeNetwork: string

  selectedNode: Node

  nodes: Node[]

  networkType: string

  pToken: string

  provider: HttpProvider | null

  checkConnection(_endpoint: string, _timeout?: number, _options?: CheckConnectionOption): Promise<boolean>

  getApi(): Promise<object>

  select(_options?: SelectOptions): Promise<Node>

  setSelectedNode(_endpoint: string | Node, _options?: SetSelectedNodeOptions): Node

  setParams(_configs: object): any

  fetchNodes(): Promise<Node[]>
}
