import utils from '../src/'
import { expect } from 'chai'

test('Should encode correctly in a Little Endian buffer the number 10', () => {
  const numberToEncode = 10
  const expectedEncodedStringHexNumber = '0a00000000000000'
  const encodedNumber = utils.converters.encodeUint64le(numberToEncode)
  const strHex = encodedNumber.toString('hex')
  expect(strHex)
    .to.be.equal(expectedEncodedStringHexNumber)
})

test('Should decode correctly a Little Endian buffer corresponding to number 10', () => {
  const expectedDecodedNumber = 10
  const encodedStrHexBuf = '0a00000000000000'
  const decodedNumber = utils.converters.decodeUint64le(
    Buffer.from(encodedStrHexBuf, 'hex')
  )
  expect(decodedNumber)
    .to.be.equal(expectedDecodedNumber)
})
