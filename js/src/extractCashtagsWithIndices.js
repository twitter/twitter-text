// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import validCashtag from './regexp/validCashtag';

export default function(text) {
  if (!text || text.indexOf('$') === -1) {
    return [];
  }

  const tags = [];

  text.replace(validCashtag, function(match, before, dollar, cashtag, offset, chunk) {
    const startPosition = offset + before.length;
    const endPosition = startPosition + cashtag.length + 1;
    tags.push({
      cashtag: cashtag,
      indices: [startPosition, endPosition]
    });
  });

  return tags;
}
