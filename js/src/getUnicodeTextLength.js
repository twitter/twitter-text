// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

/**
 * Copied from https://github.com/twitter/twitter-text/blob/master/js/twitter-text.js
 */
import nonBmpCodePairs from './regexp/nonBmpCodePairs';

export default function(text) {
  return text.replace(nonBmpCodePairs, ' ').length;
}
