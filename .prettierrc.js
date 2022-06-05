module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json-stringify'
      }
    }
  ]
};
