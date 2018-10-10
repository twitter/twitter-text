// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import astralLetterAndMarks from './astralLetterAndMarks';
import bmpLetterAndMarks from './bmpLetterAndMarks';
import nonBmpCodePairs from './nonBmpCodePairs';
import regexSupplant from '../lib/regexSupplant';

// A hashtag must contain at least one unicode letter or mark, as well as numbers, underscores, and select special characters.
const hashtagAlpha = regexSupplant(/(?:[#{bmpLetterAndMarks}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}))/, {
  bmpLetterAndMarks,
  nonBmpCodePairs,
  astralLetterAndMarks
});

export default hashtagAlpha;
