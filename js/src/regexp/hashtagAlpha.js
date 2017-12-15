import astralLetterAndMarks from './astralLetterAndMarks';
import bmpLetterAndMarks from './bmpLetterAndMarks';
import nonBmpCodePairs from './nonBmpCodePairs';
import regexSupplant from '../lib/regexSupplant';

// A hashtag must contain at least one unicode letter or mark, as well as numbers, underscores, and select special characters.
const hashtagAlpha = regexSupplant(
  /(?:[#{bmpLetterAndMarks}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}))/,
  { bmpLetterAndMarks, nonBmpCodePairs, astralLetterAndMarks }
);

export default hashtagAlpha;
