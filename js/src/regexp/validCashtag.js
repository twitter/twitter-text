// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import cashtag from './cashtag';
import punct from './punct';
import regexSupplant from '../lib/regexSupplant';
import spaces from './spaces';

const validCashtag = regexSupplant(
  '(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])',
  { cashtag, spaces, punct },
  'gi'
);

export default validCashtag;
