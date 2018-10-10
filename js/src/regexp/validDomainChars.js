// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import invalidDomainChars from './invalidDomainChars';
import regexSupplant from '../lib/regexSupplant';

const validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/, {
  invalidDomainChars
});

export default validDomainChars;
