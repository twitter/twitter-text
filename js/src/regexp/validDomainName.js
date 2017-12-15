import regexSupplant from '../lib/regexSupplant';
import validDomainChars from './validDomainChars';

const validDomainName = regexSupplant(
  /(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/,
  { validDomainChars }
);

export default validDomainName;
