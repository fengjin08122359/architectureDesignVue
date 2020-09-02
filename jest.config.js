module.exports = {
  // preset: 'ts-jest',
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require('./package.json').version,
    __BROWSER__: false,
    __BUNDLER__: true,
    __RUNTIME_COMPILE__: true,
    __GLOBAL__: false,
    __NODE_JS__: true,
    __FEATURE_OPTIONS__: true,
    __FEATURE_SUSPENSE__: true,
    // 'ts-jest': {
    //   babelConfig: true
    // },
    // 'vue-jest': {
    //   babelConfig: false
    // }
  },
  coverageDirectory: 'coverage',
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'vue'],
  moduleNameMapper: {
    '^@mikefeng110808/(.*?)$': '<rootDir>/src/packages/$1/src',
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: process.env.SKIP_E2E
    ? // ignore example tests on netlify builds since they don't contribute
      // to coverage and can cause netlify builds to fail
      ['/node_modules/', '/examples/__tests__']
    : ['/node_modules/']
}
