var postcss = require('postcss');
var yaml = require('js-yaml');
var extend = require('extend');

var defaultOptions = {
  detect: function(firstLine) {
    return firstLine.match(/^\* *$/);
  }
};

/**
 * @param {String} css
 * @param {Object} [options]
 * @param {Function} [options.detect]
 * @return {Array}
 */
function parse(css, options) {
  options = extend({}, defaultOptions, options || {});

  css = css.replace(/\r/g, '');
  var lines = css.split(/\n/g);

  var pendingCss = postcss().process(css);

  // Accessing .css forces postcss to work synchronously. So this line is important
  // even though we don't actually use the result. See https://stackoverflow.com/a/36464396
  var processedCss = pendingCss.css;

  return pendingCss.root.nodes.filter(function (rule) {
    if (rule.type === 'comment') {
      return options.detect(rule.text.split(/\n/)[0] || '');
    }
    return false;
  }).map(function (rule, index, rules) {
    var comment = normalizeComment(rule.text);
    var nextRule = rules[index + 1];
    var css = nextRule
      ? lines.slice(rule.source.end.line, nextRule.source.start.line - 1).join('\n')
      : lines.slice(rule.source.end.line).join('\n');

    return {
      annotation: yaml.safeLoad(comment),
      css: css,
      comment: comment,
      rawComment: rule.comment,
      position: rule.source
    };
  });
};

/**
 * @param {String} path
 * @param {Object} [options]
 * @param {Function} callback
 */
function parseFile(path, options, callback) {
  if (arguments.length < 3) {
    callback = options;
    options = {};

    if (typeof callback !== 'function') {
      throw 'callback parameter must be a function.';
    }
  }

  require('fs').readFile(path, {encoding: 'utf8'}, function(error, css) {
    if (error) {
      return callback(error);
    }

    callback(undefined, parse(css.toString('utf8')));
  });
}

function normalizeComment(comment) {
  return comment
    .split(/\n/g)
    .slice(1)
    .join('\n')
    .replace(/\n *\*/mg, '\n')
    .replace(/^ *\*/, '')
    .replace(/^\n+|\n+ *$/g,'');
}

module.exports = {parse: parse, parseFile: parseFile};
