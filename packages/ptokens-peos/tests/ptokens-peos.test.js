import pEOS from '../src/index'
import { expect } from 'chai'
import { TOKEN_DECIMALS } from '../src/utils/constants'

const configs = {
  ethPrivateKey: '422c874bed50b69add046296530dc580f8e2e253879d98d66023b7897ab15742',
  ethProvider: 'https://kovan.infura.io/v3/4762c881ac0c4938be76386339358ed6',
  eosPrivateKey: '5J9J3VWdCEQsShpsQScedL1debcBoecuSzfzUsvuJB14f77tiGv',
  eosProvider: 'https://ptoken-eos.provable.xyz:443'
}
// corresponsing eth address = 0xdf3B180694aB22C577f7114D822D28b92cadFd75
// corresponding eos account = all3manfr4di

jest.setTimeout(3000000)

test('Should issue 1 pEOS', async () => {
  const peosToIssue = 1
  const expectedAmountIssued = peosToIssue.toFixed(TOKEN_DECIMALS)
  const to = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  const expectedEthAccount = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

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

test('Should redeem 1 pEOS', async () => {
  const peosToRedeem = 1
  const peosToIssue = 1
  const expectedAmountRedeemed = peosToRedeem.toFixed(TOKEN_DECIMALS)
  const ethAddress = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
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

test('Should get correct balance', async () => {
  const peos = new pEOS(configs)
  const ethAddress = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  let currentBalance = await peos.getBalance(ethAddress)
  const peosToIssue = 1
  const expectedBalance = currentBalance + 1
  await peos.issue(peosToIssue, ethAddress)
  currentBalance = await peos.getBalance(ethAddress)
  expect(currentBalance).to.be.equal(expectedBalance)
})

test('Should get total number of issued pEOS', async () => {
  const peos = new pEOS(configs)
  const currentTotalIssued = await peos.getTotalIssued()
  const peosToIssue = 1
  const expectedTotalIssue = currentTotalIssued + peosToIssue
  const to = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'

  await peos.issue(peosToIssue, to)
  const totalIssued = await peos.getTotalIssued()
  expect(totalIssued).to.be.equal(expectedTotalIssue)
})

test('Should get total number of redeemed pEOS', async () => {
  const peos = new pEOS(configs)
  const currentTotalRedeemed = await peos.getTotalRedeemed()
  const peosToRedeem = 1
  const expectedTotalRedeemed = currentTotalRedeemed + peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const totalRedeemed = await peos.getTotalRedeemed()
  expect(totalRedeemed).to.be.equal(expectedTotalRedeemed)
})

test('Should get total number of circulating pEOS', async () => {
  const peos = new pEOS(configs)
  const currentCirculatingSupply = await peos.getCirculatingSupply()
  const peosToRedeem = 1
  const expectedCirculatingSupply = currentCirculatingSupply - peosToRedeem
  const to = 'all3manfr4di'

  await peos.redeem(peosToRedeem, to)
  const circulatingSupply = await peos.getCirculatingSupply()
  expect(circulatingSupply).to.be.equal(expectedCirculatingSupply)
})

test('Should transfer 1 pEOS', async () => {
  const peos = new pEOS(configs)
  const owner = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  const to = '0xaC248Dd1e6021b98556CDC4B463c34AeAaa1ed3A'

  let currentBalance = await peos.getBalance(to)
  const peosToTransfer = 1
  const peosToIssue = 1
  const expectedBalance = currentBalance + peosToTransfer

  await peos.issue(peosToIssue, owner)
  currentBalance = await peos.getBalance(owner)
  await peos.transfer(to, peosToTransfer)
  currentBalance = await peos.getBalance(to)
  expect(currentBalance).to.be.equal(expectedBalance)
})

test('Should approve correctly 1 pEOS', async () => {
  const peos = new pEOS(configs)
  const owner = '0xdf3B180694aB22C577f7114D822D28b92cadFd75'
  const to = '0xaC248Dd1e6021b98556CDC4B463c34AeAaa1ed3A'
  const expectedAllowance = 1
  const peosToApprove = 1
  const peosToIssue = 1

  await peos.issue(peosToIssue, owner)
  await peos.approve(to, peosToApprove)
  const allowance = await peos.getAllowance(owner, to)
  expect(allowance).to.be.equal(expectedAllowance)
})
