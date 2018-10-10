// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractCashtagsWithIndices from './extractCashtagsWithIndices';
import extractHashtagsWithIndices from './extractHashtagsWithIndices';
import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';
import extractUrlsWithIndices from './extractUrlsWithIndices';
import removeOverlappingEntities from './removeOverlappingEntities';

export default function(text, options) {
  const entities = extractUrlsWithIndices(text, options)
    .concat(extractMentionsOrListsWithIndices(text))
    .concat(extractHashtagsWithIndices(text, { checkUrlOverlap: false }))
    .concat(extractCashtagsWithIndices(text));

  if (entities.length == 0) {
    return [];
  }

  removeOverlappingEntities(entities);
  return entities;
}
