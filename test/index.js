const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');

const get = require('lodash.get');
const stylelint = require('stylelint');
const tmp = require('tmp');

const tempFile = util.promisify(tmp.file);
const writeFile = util.promisify(fs.writeFile);

function lint(files) {
  const options = Object.assign({
    config: {
      processors: path.resolve(__dirname, '../index.js'),
      rules: {
        'block-no-empty': true
      }
    },
    files: path.resolve(__dirname, files)
  });

  return stylelint.lint(options);
}

async function createFile(text) {
  const file = await tempFile({ postfix: '.css' });

  await writeFile(file, text, 'utf8');

  return file;
}

describe('index.js', function() {
  let pattern = 1;

  it("don't throw an error", async function() {
    const file = await createFile(['---', '---'].join('\n'));
    const { errored } = await lint(file);

    assert(errored === false);
  });
  it(`pattern ${pattern++}`, async function() {
    const file = await createFile(['---', '---', 'body {}'].join('\n'));
    const result = await lint(file);
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 3);
  });
  it(`pattern ${pattern++}`, async function() {
    const file = await createFile(['---', '---', 'body {}', ''].join('\n'));
    const result = await lint(file);
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 3);
  });
  it(`pattern ${pattern++}`, async function() {
    const file = await createFile(['---', '---', '', 'body {}'].join('\n'));
    const result = await lint(file);
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 4);
  });
  it(`pattern ${pattern++}`, async function() {
    const file = await createFile(['---', '', '---', '', 'body {}'].join('\n'));
    const result = await lint(file);
    const warning = get(result, 'results[0].warnings[0]');

    assert(warning.line === 5);
  });
});
