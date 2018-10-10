// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlUserinfo from './validateUrlUserinfo';
import validateUrlHost from './validateUrlHost';
import validateUrlPort from './validateUrlPort';

const validateUrlAuthority = regexSupplant(
  // $1 userinfo
  '(?:(#{validateUrlUserinfo})@)?' +
    // $2 host
    '(#{validateUrlHost})' +
    // $3 port
    '(?::(#{validateUrlPort}))?',
  { validateUrlUserinfo, validateUrlHost, validateUrlPort },
  'i'
);

export default validateUrlAuthority;
