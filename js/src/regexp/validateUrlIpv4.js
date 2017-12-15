import regexSupplant from '../lib/regexSupplant';
import validateUrlDecOctet from './validateUrlDecOctet';

const validateUrlIpv4 = regexSupplant(
  /(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i,
  { validateUrlDecOctet }
);

export default validateUrlIpv4;
