// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractHashtagsWithIndices from './extractHashtagsWithIndices';

export default function(text) {
  const hashtagsOnly = [];
  const hashtagsWithIndices = extractHashtagsWithIndices(text);
  for (let i = 0; i < hashtagsWithIndices.length; i++) {
    hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
  }

  return hashtagsOnly;
}
