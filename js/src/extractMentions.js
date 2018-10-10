// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractMentionsWithIndices from './extractMentionsWithIndices';

export default function(text) {
  let screenNamesOnly = [],
    screenNamesWithIndices = extractMentionsWithIndices(text);

  for (let i = 0; i < screenNamesWithIndices.length; i++) {
    const screenName = screenNamesWithIndices[i].screenName;
    screenNamesOnly.push(screenName);
  }

  return screenNamesOnly;
}
