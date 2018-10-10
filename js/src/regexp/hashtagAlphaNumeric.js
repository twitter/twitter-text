// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import astralLetterAndMarks from './astralLetterAndMarks';
import astralNumerals from './astralNumerals';
import bmpLetterAndMarks from './bmpLetterAndMarks';
import bmpNumerals from './bmpNumerals';
import hashtagSpecialChars from './hashtagSpecialChars';
import nonBmpCodePairs from './nonBmpCodePairs';
import regexSupplant from '../lib/regexSupplant';

const hashtagAlphaNumeric = regexSupplant(
  /(?:[#{bmpLetterAndMarks}#{bmpNumerals}#{hashtagSpecialChars}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}|#{astralNumerals}))/,
  {
    bmpLetterAndMarks,
    bmpNumerals,
    hashtagSpecialChars,
    nonBmpCodePairs,
    astralLetterAndMarks,
    astralNumerals
  }
);

export default hashtagAlphaNumeric;
