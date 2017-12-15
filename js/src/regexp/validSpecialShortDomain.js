import regexSupplant from '../lib/regexSupplant';
import validDomainName from './validDomainName';
import validSpecialCCTLD from './validSpecialCCTLD';

const validSpecialShortDomain = regexSupplant(
  /^#{validDomainName}#{validSpecialCCTLD}$/i,
  { validDomainName, validSpecialCCTLD }
);

export default validSpecialShortDomain;
