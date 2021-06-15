module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  overrides: [
    {
      env: {
        mocha: true
      },
      files: ['test/**/*.js']
    }
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  root: true
};
