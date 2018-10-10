// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import regexSupplant from '../lib/regexSupplant';
import validUrlQueryChars from './validUrlQueryChars';
import validUrlQueryEndingChars from './validUrlQueryEndingChars';

const validTcoUrl = regexSupplant(
  /^https?:\/\/t\.co\/([a-z0-9]+)(?:\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?/,
  { validUrlQueryChars, validUrlQueryEndingChars },
  'i'
);

export default validTcoUrl;
