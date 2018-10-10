// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import convertUnicodeIndices from './lib/convertUnicodeIndices';

export default function(text, entities) {
  convertUnicodeIndices(text, entities, true);
}
