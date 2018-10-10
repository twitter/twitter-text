// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import hashSigns from './hashSigns';
import hashtagAlpha from './hashtagAlpha';
import hashtagAlphaNumeric from './hashtagAlphaNumeric';
import hashtagBoundary from './hashtagBoundary';
import regexSupplant from '../lib/regexSupplant';

const validHashtag = regexSupplant(
  /(#{hashtagBoundary})(#{hashSigns})(?!\uFE0F|\u20E3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi,
  { hashtagBoundary, hashSigns, hashtagAlphaNumeric, hashtagAlpha }
);

export default validHashtag;
