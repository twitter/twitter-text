// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import configs from './configs';
import getTweetLength from './getTweetLength';
import hasInvalidCharacters from './hasInvalidCharacters';

export default function(text, options = configs.defaults) {
  if (!text) {
    return 'empty';
  }

  const mergedOptions = { ...configs.defaults, ...options };
  const maxLength = mergedOptions.maxWeightedTweetLength;

  // Determine max length independent of URL length
  if (getTweetLength(text, mergedOptions) > maxLength) {
    return 'too_long';
  }

  if (hasInvalidCharacters(text)) {
    return 'invalid_characters';
  }

  return false;
}
