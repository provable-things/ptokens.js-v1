export class NodeSelector {
  constructor(
    configs: {
      pToken: {
        name: string,
        redeemFrom: string
      },
      defaultNode?: string
    }
  )

  checkConnection(_endpoint: string, _timeout?: number): Promise<boolean>

  getApi(): Promise<object>

  select(): Promise<SelectedNode>

  set(_endpoint: string): Promise<SelectedNode>
}

export interface SelectedNode {
  endpoint: string,
  api: object
}
