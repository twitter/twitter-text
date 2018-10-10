// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

console.log("Running Node tests")

assert = require('assert');

assert.equal(typeof window, 'undefined', 'window is undefined before requiring twitter-text');
assert.equal(typeof twttr, 'undefined', 'twttr is undefined before requiring twitter-text');

var twitter = require('../twitter-text');

assert.equal(typeof twitter.autoLink, 'function', 'twttr.txt is exported');
assert.equal(typeof twttr, 'undefined', 'twttr is undefined after requiring twitter-text');
assert.equal(typeof window, 'undefined', 'window is undefined after requiring twitter-text');

var fs = require('fs');
var path = require('path');
fs.readFileSync(path.resolve(__dirname, '../twitter-text.js'), "utf8").split('\n').forEach(function(line, lineNumber) {
  var isComment = false;
  // This matches runs of 'foo' "bar" /meh/ or even // with escaping like "foo\"bar"
  line.replace(/(["'\/])((?:(?!\1|\\).)*(?:\\.(?:(?!\1|\\).)*)*)\1/g, function(all, quote, content) {
    if (isComment || quote == '/' && !content) {
      isComment = true;
    } else if (quote != '/') {
      assert(!/(^|[^\\])\\u/.test(content), "Literal string contains potentially dangerous unicode escape on line " + (lineNumber + 1) +
          " of twitter-text.js. It is safer to put these into a RegEx literal to avoid unicode normalization after minification.");
    }
  });
});

console.log("Node tests passed")