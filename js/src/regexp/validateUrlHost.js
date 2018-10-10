// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlDomain from './validateUrlDomain';
import validateUrlIp from './validateUrlIp';

const validateUrlHost = regexSupplant(
  '(?:' + '#{validateUrlIp}|' + '#{validateUrlDomain}' + ')',
  { validateUrlIp, validateUrlDomain },
  'i'
);

export default validateUrlHost;
