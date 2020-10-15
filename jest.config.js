module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/__tests__/**/*'],
  setupFiles: ['<rootDir>/src/__tests__/__setup__/index.js'],
  testRegex: 'src/.+\\.test\\.js$',
};
