const PEOS = 'peos'
const PBTC = 'pbtc'

/**
 * @param {String} _pToken
 */
const pTokenNameIsValid = _pToken => {
  if (_pToken.toLowerCase() === PEOS) return true
  if (_pToken.toLowerCase() === PBTC) return true
  return false
}

/**
 * @param {String} _pToken
 */
const pTokenNameNormalized = _pToken => _pToken.toLowerCase()

export { pTokenNameIsValid, pTokenNameNormalized }
