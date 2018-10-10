// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlIpv4 from './validateUrlIpv4';
import validateUrlIpv6 from './validateUrlIpv6';

// Punting on IPvFuture for now
const validateUrlIp = regexSupplant(
  '(?:' + '#{validateUrlIpv4}|' + '#{validateUrlIpv6}' + ')',
  { validateUrlIpv4, validateUrlIpv6 },
  'i'
);

export default validateUrlIp;
