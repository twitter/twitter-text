// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlDomainSegment from './validateUrlDomainSegment';
import validateUrlDomainTld from './validateUrlDomainTld';
import validateUrlSubDomainSegment from './validateUrlSubDomainSegment';

const validateUrlDomain = regexSupplant(
  /(?:(?:#{validateUrlSubDomainSegment}\.)*(?:#{validateUrlDomainSegment}\.)#{validateUrlDomainTld})/i,
  {
    validateUrlSubDomainSegment,
    validateUrlDomainSegment,
    validateUrlDomainTld
  }
);

export default validateUrlDomain;
