import regexSupplant from '../lib/regexSupplant';
import validDomainChars from './validDomainChars';

const validSubdomain = regexSupplant(
  /(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/,
  { validDomainChars }
);

export default validSubdomain;
