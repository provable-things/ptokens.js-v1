import { HttpProvider } from 'ptokens-node'

const provider = new HttpProvider('endpoint')

// $ExpectType Promise<any>
provider.call('GET', '/')

// $ExpectType any
provider.setEndpoint('endpoint')

// $ExpectType any
provider.setHeaders({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, Content-Type',
  'Content-Type': 'application/json'
})
