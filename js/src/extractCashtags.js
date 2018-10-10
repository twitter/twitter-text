// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractCashtagsWithIndices from './extractCashtagsWithIndices';

export default function(text) {
  const cashtagsOnly = [],
    cashtagsWithIndices = extractCashtagsWithIndices(text);

  for (let i = 0; i < cashtagsWithIndices.length; i++) {
    cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
  }

  return cashtagsOnly;
}
