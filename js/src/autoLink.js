// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractEntitiesWithIndices from './extractEntitiesWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function(text, options) {
  const entities = extractEntitiesWithIndices(text, {
    extractUrlsWithoutProtocol: false
  });
  return autoLinkEntities(text, entities, options);
}
