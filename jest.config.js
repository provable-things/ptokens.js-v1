const config = {
  testEnvironment: "node",
  collectCoverage: true,
  resetModules: true,
  testMatch: ['/**/**.test.js'],
  transform: {
      '^.+\\.js$': '<rootDir>/../../jest.preprocessor.js'
  },
  coveragePathIgnorePatterns: [
      'node_modules',
      'dist',
  ],
  verbose: true
}

module.exports = () => {
  return config
}