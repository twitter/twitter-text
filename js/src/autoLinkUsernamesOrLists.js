// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function(text, options) {
  const entities = extractMentionsOrListsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
