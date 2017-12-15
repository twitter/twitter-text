import regexSupplant from '../lib/regexSupplant';
import validateUrlIpv4 from './validateUrlIpv4';
import validateUrlIpv6 from './validateUrlIpv6';

// Punting on IPvFuture for now
const validateUrlIp = regexSupplant(
  '(?:' +
    '#{validateUrlIpv4}|' +
    '#{validateUrlIpv6}' +
  ')',
  { validateUrlIpv4, validateUrlIpv6 },
  'i'
);

export default validateUrlIp;
