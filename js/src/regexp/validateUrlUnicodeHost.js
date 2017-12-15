import regexSupplant from '../lib/regexSupplant';
import validateUrlIp from './validateUrlIp';
import validateUrlUnicodeDomain from './validateUrlUnicodeDomain';

const validateUrlUnicodeHost = regexSupplant(
  '(?:' +
    '#{validateUrlIp}|' +
    '#{validateUrlUnicodeDomain}' +
  ')',
  { validateUrlIp, validateUrlUnicodeDomain },
  'i'
);

export default validateUrlUnicodeHost;
