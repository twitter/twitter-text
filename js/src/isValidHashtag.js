// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractHashtags from './extractHashtags';

export default function(hashtag) {
  if (!hashtag) {
    return false;
  }

  const extracted = extractHashtags(hashtag);

  // Should extract the hashtag minus the # sign, hence the .slice(1)
  return extracted.length === 1 && extracted[0] === hashtag.slice(1);
}
