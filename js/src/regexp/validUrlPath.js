// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validGeneralUrlPathChars from './validGeneralUrlPathChars';
import validUrlBalancedParens from './validUrlBalancedParens';
import validUrlPathEndingChars from './validUrlPathEndingChars';

// Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
const validUrlPath = regexSupplant(
  '(?:' +
    '(?:' +
    '#{validGeneralUrlPathChars}*' +
    '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' +
    '#{validUrlPathEndingChars}' +
    ')|(?:@#{validGeneralUrlPathChars}+/)' +
    ')',
  {
    validGeneralUrlPathChars,
    validUrlBalancedParens,
    validUrlPathEndingChars
  },
  'i'
);

export default validUrlPath;
