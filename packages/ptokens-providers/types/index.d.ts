import { AxiosInstance } from 'axios'

export class HttpProvider {
  constructor(_endpoint: string)

  api: AxiosInstance

  call(_callType: string, _apiPath: string, _params?: any[], _timeout?: number): Promise<any>
}
