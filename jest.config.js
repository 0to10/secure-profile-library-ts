/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  detectOpenHandles: true,
  testMatch: [
      '**/tests/**/*.test.ts',
  ],
  // collectCoverageFrom: [
  //     './src/**',
  // ],
};