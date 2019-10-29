import pTokens from '../src/index'
import pEOS from 'ptokens-peos'
import Enclave from 'ptokens-enclave'
import { expect } from 'chai'

test('Should init pTokens correctly', () => {
  const configs = {
    ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosProvider: 'https://ptoken-eos.provable.xyz:443'
  }
  const ptokens = new pTokens(configs)
  expect(ptokens.peos).to.be.an.instanceof(pEOS)
  expect(ptokens.enclave).to.be.an.instanceof(Enclave)
})
