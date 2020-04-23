const frontMatter = require('front-matter');

module.exports = function () {
  const newLines = {};

  return {
    code(input, filepath) {
      if (!frontMatter.test(input)) {
        return input;
      }

      const { body } = frontMatter(input);

      const newlineMatcher = /\r?\n/g;

      const inputMatchResult = input.match(newlineMatcher) || { length: 0 };
      const inputLines = inputMatchResult.length;

      const bodyMatchResult = body.match(newlineMatcher) || { length: 0 };
      const bodyLines = bodyMatchResult.length;

      newLines[filepath] = inputLines - bodyLines;

      return body;
    },
    result(stylelintResult, filepath) {
      stylelintResult.warnings.forEach(function (warning) {
        warning.line += newLines[filepath] || 0;
      });

      return stylelintResult;
    }
  };
};
