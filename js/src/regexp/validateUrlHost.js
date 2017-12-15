import regexSupplant from '../lib/regexSupplant';
import validateUrlDomain from './validateUrlDomain';
import validateUrlIp from './validateUrlIp';

const validateUrlHost = regexSupplant(
  '(?:' +
    '#{validateUrlIp}|' +
    '#{validateUrlDomain}' +
  ')',
  { validateUrlIp, validateUrlDomain },
  'i'
);

export default validateUrlHost;
