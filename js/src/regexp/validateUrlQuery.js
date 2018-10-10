// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validateUrlPchar from './validateUrlPchar';

const validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i, {
  validateUrlPchar
});

export default validateUrlQuery;
