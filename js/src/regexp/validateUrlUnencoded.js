// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';

// Modified version of RFC 3986 Appendix B
const validateUrlUnencoded = regexSupplant(
  '^' + // Full URL
  '(?:' +
  '([^:/?#]+):\\/\\/' + // $1 Scheme
  ')?' +
  '([^/?#]*)' + // $2 Authority
  '([^?#]*)' + // $3 Path
  '(?:' +
  '\\?([^#]*)' + // $4 Query
  ')?' +
  '(?:' +
  '#(.*)' + // $5 Fragment
    ')?$',
  'i'
);

export default validateUrlUnencoded;
