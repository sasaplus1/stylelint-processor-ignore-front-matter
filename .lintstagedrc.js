module.exports = {
  '*.js': ['eslint --cache', 'prettier --check'],
  '*.yml': 'prettier --check',
  'package.json': [
    'npx fixpack --dryRun',
    'prettier --check --parser json-stringify'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
