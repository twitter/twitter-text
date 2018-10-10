// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import autoLinkEntities from './autoLinkEntities';
import extractCashtagsWithIndices from './extractCashtagsWithIndices';

export default function(text, options) {
  const entities = extractCashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
