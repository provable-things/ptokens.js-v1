import { pEOS } from '../src/index'

test('Should initialize a pEOS instance with correct eth & eos private keys and rpc', () => {
  const expectedEthPrivateKey = '348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
  const expectedEthRpc = 'eth rpc'
  const options = {
    ethPrivateKey: '348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
    ethRpc: 'eth rpc',
    eosPrivateKey: '5JVYgcTvnPmknfHRsyJQ67EFx3zN5mnNqijQ9LspAwnp9PqrW5N',
    eosRpc: 'eos rpc',
    eosAccountName: 'all3manfr4di'
  }
  const peos = new pEOS(options)
  expect(peos.ethPrivateKey).toBe(expectedEthPrivateKey)
  expect(peos.ethRpc).toBe(expectedEthRpc)
})

test('Should initialize issue 10 pEOS', () => {
  const expectedEthPrivateKey = '348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
  const expectedEthRpc = 'eth rpc'
  const options = {
    ethPrivateKey: '348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
    ethRpc: 'eth rpc',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosRpc: 'https://ptoken-eos.provable.xyz:443',
    eosAccountName: 'all3manfr4di'
  }
  const peos = new pEOS(options)
  peos.issue(10, '0x9F82b42D6de722D0079B22a987037a5CBac87691')
  expect(peos.ethPrivateKey).toBe(expectedEthPrivateKey)
  expect(peos.ethRpc).toBe(expectedEthRpc)
})
