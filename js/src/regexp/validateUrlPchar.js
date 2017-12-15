import regexSupplant from '../lib/regexSupplant';
import validateUrlUnreserved from './validateUrlUnreserved';
import validateUrlPctEncoded from './validateUrlPctEncoded';
import validateUrlSubDelims from './validateUrlSubDelims';

// These URL validation pattern strings are based on the ABNF from RFC 3986
const validateUrlPchar = regexSupplant(
  '(?:' +
    '#{validateUrlUnreserved}|' +
    '#{validateUrlPctEncoded}|' +
    '#{validateUrlSubDelims}|' +
    '[:|@]' +
  ')',
  { validateUrlUnreserved, validateUrlPctEncoded, validateUrlSubDelims },
  'i'
);

export default validateUrlPchar;
