// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlIp from './validateUrlIp';
import validateUrlUnicodeDomain from './validateUrlUnicodeDomain';

const validateUrlUnicodeHost = regexSupplant(
  '(?:' + '#{validateUrlIp}|' + '#{validateUrlUnicodeDomain}' + ')',
  { validateUrlIp, validateUrlUnicodeDomain },
  'i'
);

export default validateUrlUnicodeHost;
