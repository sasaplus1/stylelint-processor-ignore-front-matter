'use strict';

const frontMatter = require('front-matter');

module.exports = function() {
  const newlines = {};

  return {
    code(input, filepath) {
      if (!frontMatter.test(input)) {
        newlines[filepath] = 0;

        return input;
      }

      const content = frontMatter(input);
      const body = content.body;

      const newlineMatcher = /\r?\n/g;

      newlines[filepath] =
        input.match(newlineMatcher).length - body.match(newlineMatcher).length;

      return body;
    },
    result(stylelintResult, filepath) {
      stylelintResult.warnings.forEach(function(warning) {
        warning.line += newlines[filepath];
      });

      return stylelintResult;
    }
  };
};
