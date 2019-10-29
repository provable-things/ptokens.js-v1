import pEOS from '../src/index'
import { expect } from 'chai'

const sleep = ms =>
  new Promise(resolve => setTimeout(() => resolve(), ms))

const TOKEN_DECIMALS = 4

const configs = {
  ethPrivateKey: '0x10f41f6e85e1a96acd10d39d391fbaa2653eb52354daef129b4f0e247bf06bd0',
  ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
  eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
  eosProvider: 'https://ptoken-eos.provable.xyz:443'
}

jest.setTimeout(3000000)

test('Should issue 1 pEOS with callback', async () => {
  const peosToIssue = 1
  const expectedAmountIssued = peosToIssue.toFixed(TOKEN_DECIMALS)
  const to = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'
  const expectedEthAccount = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'

  let eosTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, to, r => {
        expect(r).to.deep.include({
          totalIssued: expectedAmountIssued,
          to: expectedEthAccount
        })
        resolve()
      })
        .once('onEosTxConfirmed', () => { eosTxIsConfirmed = true })
        .once('onEnclaveReceivedTx', () => { enclaveHasReceivedTx = true })
        .once('onEnclaveBroadcastedTx', () => { enclaveHasBroadcastedTx = true })
        .once('onEthTxConfirmed', () => { ethTxIsConfirmed = true })
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

  let eosTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let ethTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, to)
        .once('onEosTxConfirmed', () => { eosTxIsConfirmed = true })
        .once('onEnclaveReceivedTx', () => { enclaveHasReceivedTx = true })
        .once('onEnclaveBroadcastedTx', () => { enclaveHasBroadcastedTx = true })
        .once('onEthTxConfirmed', () => { ethTxIsConfirmed = true })
        .then(r => {
          expect(r).to.deep.include({
            totalIssued: expectedAmountIssued,
            to: expectedEthAccount
          })
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

  let ethTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, ethAddress)
      peos.redeem(peosToRedeem, to, r => {
        expect(r).to.deep.include({
          totalRedeemed: expectedAmountRedeemed,
          to: expectedEosAccount
        })
        resolve()
      })
        .once('onEthTxConfirmed', () => { ethTxIsConfirmed = true })
        .once('onEnclaveReceivedTx', () => { enclaveHasReceivedTx = true })
        .once('onEnclaveBroadcastedTx', () => { enclaveHasBroadcastedTx = true })
        .once('onEosTxConfirmed', () => { eosTxIsConfirmed = true })
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

  let ethTxIsConfirmed = false
  let enclaveHasReceivedTx = false
  let enclaveHasBroadcastedTx = false
  let eosTxIsConfirmed = false
  const start = () =>
    new Promise(resolve => {
      const peos = new pEOS(configs)
      peos.issue(peosToIssue, ethAddress)
      peos.redeem(peosToRedeem, to)
        .once('onEthTxConfirmed', () => { ethTxIsConfirmed = true })
        .once('onEnclaveReceivedTx', () => { enclaveHasReceivedTx = true })
        .once('onEnclaveBroadcastedTx', () => { enclaveHasBroadcastedTx = true })
        .once('onEosTxConfirmed', () => { eosTxIsConfirmed = true })
        .then(r => {
          expect(r).to.deep.include({
            totalRedeemed: expectedAmountRedeemed,
            to: expectedEosAccount
          })
          resolve()
        })
    })
  await start()
  expect(ethTxIsConfirmed).to.equal(true)
  expect(enclaveHasReceivedTx).to.equal(true)
  expect(enclaveHasBroadcastedTx).to.equal(true)
  expect(eosTxIsConfirmed).to.equal(true)
})

test('Should get total number of issued pEOS with callback', async () => {
  const peos = new pEOS(configs)
  
  const currentTotalIssued = await peos.getTotalIssued()
  const peosToIssue = 1
  const expectedTotalIssue = currentTotalIssued + peosToIssue
  const to = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'

  await peos.issue(peosToIssue, to)
  const check = () =>
    new Promise(resolve => {
      peos.getTotalIssued(totalIssued => {
        expect(totalIssued).to.be.equal(expectedTotalIssue)
        resolve()
      })
    })
  await check()
})

test('Should get total number of issued pEOS with promises', async () => {
  const peos = new pEOS(configs)
  await sleep(500)
  const currentTotalIssued = await peos.getTotalIssued()
  const peosToIssue = 1
  const expectedTotalIssue = currentTotalIssued + peosToIssue
  const to = '0x612deB505E4A26729C0a2F49c622d036DB3ad5BF'

  await peos.issue(peosToIssue, to)
  const totalIssued = await peos.getTotalIssued()
  expect(totalIssued).to.be.equal(expectedTotalIssue)
})

test('Should get total number of redeemed pEOS with callback', async () => {
  const peos = new pEOS(configs)
  await sleep(500)
  const currentTotalRedeemed = await peos.getTotalRedeemed()
  const peosToRedeem = 1
  const expectedTotalRedeemed = currentTotalRedeemed + peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const check = () =>
    new Promise(resolve => {
      peos.getTotalRedeemed(totalRedeemed => {
        expect(totalRedeemed).to.be.equal(expectedTotalRedeemed)
        resolve()
      })
    })
  await check()
})

test('Should get total number of redeemed pEOS with promises', async () => {
  const peos = new pEOS(configs)
  await sleep(500)
  const currentTotalRedeemed = await peos.getTotalRedeemed()
  const peosToRedeem = 1
  const expectedTotalRedeemed = currentTotalRedeemed + peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const totalRedeemed = await peos.getTotalRedeemed()
  expect(totalRedeemed).to.be.equal(expectedTotalRedeemed)
})

test('Should get total number of circulating pEOS with callback', async () => {
  const peos = new pEOS(configs)
  await sleep(500)
  const currentCirculatingSupply = await peos.getCirculatingSupply()
  const peosToRedeem = 1
  const expectedCirculatingSupply = currentCirculatingSupply - peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const check = () =>
    new Promise(resolve => {
      peos.getCirculatingSupply(circulatingSupply => {
        expect(circulatingSupply).to.be.equal(expectedCirculatingSupply)
        resolve()
      })
    })
  await check()
})

test('Should get total number of circulating pEOS with promises', async () => {
  const peos = new pEOS(configs)
  await sleep(500)
  const currentCirculatingSupply = await peos.getCirculatingSupply()
  const peosToRedeem = 1
  const expectedCirculatingSupply = currentCirculatingSupply - peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const circulatingSupply = await peos.getCirculatingSupply()
  expect(circulatingSupply).to.be.equal(expectedCirculatingSupply)
})
