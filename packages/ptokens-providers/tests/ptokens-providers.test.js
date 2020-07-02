import { HttpProvider } from '../src/index'
import { expect } from 'chai'

const ENDPOINT = 'https://pbtc-node-1a.ngrok.io'

test('Should make a GET call', async () => {
  const provider = new HttpProvider(ENDPOINT)

  const res = await provider.call('GET', '/pbtc-on-eth/get-info')
  expect(res).to.be.an.instanceOf(Object)
})

test('Should make a GET call with timeout error', async () => {
  const provider = new HttpProvider(ENDPOINT)
  try {
    await provider.call('GET', '/pbtc-on-eth/get-info', [], 0.01)
  } catch (err) {
    expect(err.message).to.be.eq('timeout of 0.01ms exceeded')
  }
})

test('Should make a GET call with custom header', async () => {
  const provider = new HttpProvider(ENDPOINT, {
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json'
  })

  const res = await provider.call('GET', '/pbtc-on-eth/get-info')
  expect(res).to.be.an.instanceOf(Object)
})
