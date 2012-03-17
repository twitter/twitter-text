assert = require('assert');

assert.equal(typeof window, 'undefined', 'window is undefined before requiring twitter-text');
assert.equal(typeof twttr, 'undefined', 'twttr is undefined before requiring twitter-text');

var twitter = require('../twitter-text');

assert.equal(typeof twttrtxt.autoLink, 'function', 'twttr.txt is exported');
assert.equal(typeof twttr, 'undefined', 'twttr is undefined after requiring twitter-text');
assert.equal(typeof window, 'undefined', 'window is undefined after requiring twitter-text');
