module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      env: {
        mocha: true
      },
      files: ['test/**/*.js']
    }
  ],
  parserOptions: {
    ecmaVersion: 2019
  },
  root: true
};
