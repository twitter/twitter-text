// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import codePoint from './codePoint';
import hashtagAlphaNumeric from './hashtagAlphaNumeric';
import regexSupplant from '../lib/regexSupplant';

const hashtagBoundary = regexSupplant(/(?:^|\uFE0E|\uFE0F|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/, {
  codePoint,
  hashtagAlphaNumeric
});

export default hashtagBoundary;
