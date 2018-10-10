// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractHashtagsWithIndices from './extractHashtagsWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function(text, options) {
  const entities = extractHashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
