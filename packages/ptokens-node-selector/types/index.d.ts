import { Node, Report } from 'ptokens-node'

export interface NodeSelectorConfigs {
  pToken: {
    name: string,
    hostBlockchain: string
  },
  defaultEndpoint?: string,
  networkType: string | Promise<string>
}

export interface NodeList extends Array<Node> {}

export class NodeSelector {
  constructor(_configs: NodeSelectorConfigs)

  selectedNode: Node

  nodes: NodeList

  info: object

  defaultEndpoint: string | null

  networkType: string

  checkConnection(_endpoint: string, _timeout?: number): Promise<boolean>

  getApi(): Promise<object>

  select(): Promise<Node>

  setEndpoint(_endpoint: string): Node

  getNetworkType(): Promise<string>

  setNetworkType(_type: string): string
}
