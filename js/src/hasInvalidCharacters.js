// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import invalidChars from './regexp/invalidChars';

export default function(text) {
  return invalidChars.test(text);
}
