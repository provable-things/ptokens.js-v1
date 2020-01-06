import validate from 'bitcoin-address-validation'

/**
 * @param {String} _address
 * @param {String} _network
 */
const isValidAddress = _address => {
  return validate(_address)
}

export {
  isValidAddress
}
