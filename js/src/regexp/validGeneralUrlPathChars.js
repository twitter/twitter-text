// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import cyrillicLettersAndMarks from './cyrillicLettersAndMarks';
import latinAccentChars from './latinAccentChars';
import regexSupplant from '../lib/regexSupplant';

const validGeneralUrlPathChars = regexSupplant(
  /[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-\u2013_~@\|&#{latinAccentChars}]/i,
  { cyrillicLettersAndMarks, latinAccentChars }
);

export default validGeneralUrlPathChars;
