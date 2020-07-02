import { HttpProvider } from 'ptokens-node'

const provider = new HttpProvider('endpoint')

// $ExpectType Promise<any>
provider.call('GET', '/')
