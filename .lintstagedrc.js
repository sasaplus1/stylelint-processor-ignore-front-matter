module.exports = {
  '*.js': ['eslint', 'prettier --check'],
  '*.+(md|yml)': 'prettier --check',
  '!(package|package-lock).json': 'prettier --check',
  'package.json': ['npx fixpack --dryRun', 'prettier --check']
};
