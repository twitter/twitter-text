import cyrillicLettersAndMarks from './cyrillicLettersAndMarks';
import latinAccentChars from './latinAccentChars';
import regexSupplant from '../lib/regexSupplant';
import validUrlBalancedParens from './validUrlBalancedParens';

// Valid end-of-path chracters (so /foo. does not gobble the period).
// 1. Allow =&# for empty URL parameters and other URL-join artifacts
const validUrlPathEndingChars = regexSupplant(
  /[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i,
  { cyrillicLettersAndMarks, latinAccentChars, validUrlBalancedParens }
);

export default validUrlPathEndingChars;
