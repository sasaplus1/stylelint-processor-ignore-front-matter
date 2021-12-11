const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');

const get = require('lodash.get');
const stylelint = require('stylelint');
const tmp = require('tmp');

const tempFile = util.promisify(tmp.file);
const writeFile = util.promisify(fs.writeFile);

async function createFile(text) {
  const file = await tempFile({ postfix: '.css' });

  await writeFile(file, text, 'utf8');

  return file;
}

describe('index.js', function () {
  const options = {
    config: {
      processors: path.resolve(__dirname, '../index.js'),
      rules: {
        'block-no-empty': true
      }
    }
  };

  it("don't throw an error", async function () {
    const file = await createFile(['---', '---'].join('\n'));

    const { errored } = await stylelint.lint({
      ...options,
      files: file
    });

    assert(errored === false);
  });
  it('has not EOL', async function () {
    const file = await createFile(['---', '---', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 3);
  });
  it('has EOL', async function () {
    const file = await createFile(['---', '---', 'body {}', ''].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 3);
  });
  it('LF before selector', async function () {
    const file = await createFile(['---', '---', '', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 4);
  });
  it('has Front-matter', async function () {
    const file = await createFile(['---', '', '---', '', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 5);
  });
});
