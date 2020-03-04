const availables = {
  pbtc: ['ETH']
}

/**
 * @param {String} _pTokenName
 */
const pTokenNameIsValid = _pTokenName => {
  if (_pTokenName.toLowerCase() === 'pbtc') return true
  return false
}

/**
 * @param {Object} _pToken
 */
const pTokenIsValid = _pToken => {
  const { name, redeemFrom } = _pToken

  if (!pTokenNameIsValid(name)) return false

  if (!availables[name.toLowerCase()].includes(redeemFrom.toUpperCase()))
    return false

  return true
}

export { pTokenNameIsValid, pTokenIsValid }
