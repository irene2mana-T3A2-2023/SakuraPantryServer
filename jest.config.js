export default {
  // Sets the testing environment to Node.js. This is useful for server-side testing.
  testEnvironment: 'node',

  // An array of glob patterns indicating a set of files for which test coverage information should be skipped.
  coveragePathIgnorePatterns: ['/node_modules/'],

  // Path to a module that runs some code to configure or set up the testing environment before each test.
  globalSetup: '<rootDir>/src/tests/globalSetup.js',

  // An array of file paths that will be run after the test framework has been installed in the testing environment but before the tests are run.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupFile.js'],

  transform: {}
};
