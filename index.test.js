const assert = require('assert');
const fs = require('fs');

const get = require('lodash.get');
const stylelint = require('stylelint');
const tmp = require('tmp');

describe('index.js', function () {
  function createFile(text) {
    return new Promise(function (resolve, reject) {
      tmp.file(function (err, name) {
        if (err) {
          reject(err);
          return;
        }

        fs.writeFile(name, text, 'utf8', function (err) {
          if (err) {
            reject(err);
            return;
          }

          resolve(name);
        });
      });
    });
  }

  const options = {
    config: {
      processors: require.resolve('.'),
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

    assert.strictEqual(errored, false);
  });
  it('has not EOL', async function () {
    const file = await createFile(['---', '---', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert.strictEqual(warning.line, 3);
  });
  it('has EOL', async function () {
    const file = await createFile(['---', '---', 'body {}', ''].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert.strictEqual(warning.line, 3);
  });
  it('LF before selector', async function () {
    const file = await createFile(['---', '---', '', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert.strictEqual(warning.line, 4);
  });
  it('has Front-matter', async function () {
    const file = await createFile(['---', '', '---', '', 'body {}'].join('\n'));
    const result = await stylelint.lint({
      ...options,
      files: file
    });
    const warning = get(result, 'results[0].warnings[0]');

    assert.strictEqual(warning.line, 5);
  });
});
