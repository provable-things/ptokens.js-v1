const config = {
  collectCoverage: true,
  resetModules: true,
  testMatch: ['/**/**.test.js'],
  transform: {
      '^.+\\.js$': '<rootDir>/../../jest.preprocessor.js'
  },
  coveragePathIgnorePatterns: [
      'node_modules',
      'dist',
  ]
}

module.exports = () => {
  return config
}