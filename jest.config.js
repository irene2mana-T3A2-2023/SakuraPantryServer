export default {
  // Define the environment in which the tests will run. 'node' indicates a server-side environment, which is optimal for backend testing.
  testEnvironment: 'node',

  // An array of glob patterns indicating a set of files for which test coverage information should be skipped. Here, all files within 'node_modules' are ignored.
  coveragePathIgnorePatterns: ['/node_modules/'],

  // Provide the path to a module that sets up the global environment for tests. This script runs once before all test suites.
  globalSetup: '<rootDir>/src/tests/globalSetup.js',

  // List of scripts to be executed after the Jest environment is set up but before tests begin. Useful for per-test setup.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupFile.js'],

  // Configuration object for transforming modules.
  transform: {}
};
