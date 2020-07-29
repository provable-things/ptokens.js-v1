import { AxiosInstance } from 'axios'

export class HttpProvider {
  constructor(_endpoint?: string, _headers?: object)

  api: AxiosInstance

  call(_callType: string, _apiPath: string, _params?: any[], _timeout?: number): Promise<any>

  setEndpoint(_endpoint: string): any

  setheaders(_headers: object): any
}
