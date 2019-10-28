import { pEOS } from '../src/index'
import { expect } from 'chai'

const TOKEN_DECIMALS = 4

const sleep = ms => 
  new Promise(resolve => setTimeout(() => resolve(), ms))

jest.setTimeout(300000)

test('Should issue 1 pEOS with callback', async () => {
  const peosToIssue = 1
  const expectedAmountIssued = peosToIssue.toFixed(TOKEN_DECIMALS)
  const to = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const expectedEthAccount = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const configs = {
    ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosProvider: 'https://ptoken-eos.provable.xyz:443',
  }
  
  let eosTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = async () => 
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, to, r => {
        expect(r).to.deep.include({
          success: true,
          payload: {
            totalIssued: expectedAmountIssued,
            to: expectedEthAccount
          }
        })
        resolve()
      })
      .once('onEosTxConfirmed', () => eosTxIsConfirmed = true)
      .once('onEnclaveReceivedTx', () => enclaveHasReceivedTx = true)
      .once('onEnclaveBroadcastedTx', () => enclaveHasBroadcastedTx = true)
      .once('onEthTxConfirmed', () => ethTxIsConfirmed = true)
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(true)
  expect(enclaveHasReceivedTx).to.equal(true)
  expect(enclaveHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should issue 1 pEOS with promises', async () => {
  const peosToIssue = 1
  const expectedAmountIssued = peosToIssue.toFixed(TOKEN_DECIMALS)
  const to = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const expectedEthAccount = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const configs = {
    ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosProvider: 'https://ptoken-eos.provable.xyz:443',
  }
  
  let eosTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = async () => 
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, to)
      .once('onEosTxConfirmed', () => eosTxIsConfirmed = true)
      .once('onEnclaveReceivedTx', () => enclaveHasReceivedTx = true)
      .once('onEnclaveBroadcastedTx', () => enclaveHasBroadcastedTx = true)
      .once('onEthTxConfirmed', () => ethTxIsConfirmed = true)
      .then(async r => {
        expect(r).to.deep.include({
          success: true,
          payload: {
            totalIssued: expectedAmountIssued,
            to: expectedEthAccount
          }
        })
        //NOTE: it can happen that the promise is resolved before the event even if the execution order is not so
        sleep(100)
        resolve()
      })
    })
  await start()
  expect(eosTxIsConfirmed).to.equal(true)
  expect(enclaveHasReceivedTx).to.equal(true)
  expect(enclaveHasBroadcastedTx).to.equal(true)
  expect(ethTxIsConfirmed).to.equal(true)
})

test('Should redeem 1 pEOS with callback', async () => {
  const peosToRedeem = 1
  const peosToIssue = 1
  const expectedAmountRedeemed = peosToRedeem.toFixed(TOKEN_DECIMALS)
  const ethAddress = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const to = 'all3manfr4di'
  const expectedEosAccount = 'all3manfr4di'
  const configs = {
    ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosProvider: 'https://ptoken-eos.provable.xyz:443',
  }
  
  let ethTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = async () => 
    new Promise(async resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, ethAddress)
      peos.redeem(peosToRedeem, to, r => {
        expect(r).to.deep.include({
          success: true,
          payload: {
            totalRedeemed: expectedAmountRedeemed,
            to: expectedEosAccount
          }
        })
        resolve()
      })
      .once('onEthTxConfirmed', () => ethTxIsConfirmed = true)
      .once('onEnclaveReceivedTx', () => enclaveHasReceivedTx = true)
      .once('onEnclaveBroadcastedTx', () => enclaveHasBroadcastedTx = true)
      .once('onEosTxConfirmed', () => eosTxIsConfirmed = true)
    })
  await start()
  expect(ethTxIsConfirmed).to.equal(true)
  expect(enclaveHasReceivedTx).to.equal(true)
  expect(enclaveHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

test('Should redeem 1 pEOS with promises', async () => {
  const peosToRedeem = 1
  const peosToIssue = 1
  const expectedAmountRedeemed = peosToRedeem.toFixed(TOKEN_DECIMALS)
  const ethAddress = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const to = 'all3manfr4di'
  const expectedEosAccount = 'all3manfr4di'
  const configs = {
    ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
    ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
    eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
    eosProvider: 'https://ptoken-eos.provable.xyz:443',
  }
  
  let ethTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = async () => 
    new Promise(async resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, ethAddress)
      peos.redeem(peosToRedeem, to)
      .once('onEthTxConfirmed', () => ethTxIsConfirmed = true)
      .once('onEnclaveReceivedTx', () => enclaveHasReceivedTx = true)
      .once('onEnclaveBroadcastedTx', () => enclaveHasBroadcastedTx = true)
      .once('onEosTxConfirmed', () => eosTxIsConfirmed = true)
      .then(async r => {
        expect(r).to.deep.include({
          success: true,
          payload: {
            totalRedeemed: expectedAmountRedeemed,
            to: expectedEosAccount
          }
        })
        sleep(100)
        resolve()
      })
    })
  await start()
  expect(ethTxIsConfirmed).to.equal(true)
  expect(enclaveHasReceivedTx).to.equal(true)
  expect(enclaveHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})