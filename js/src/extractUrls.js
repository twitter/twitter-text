// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractUrlsWithIndices from './extractUrlsWithIndices';

export default function(text, options) {
  const urlsOnly = [];
  const urlsWithIndices = extractUrlsWithIndices(text, options);

  for (let i = 0; i < urlsWithIndices.length; i++) {
    urlsOnly.push(urlsWithIndices[i].url);
  }

  return urlsOnly;
}
