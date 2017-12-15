import regexSupplant from '../lib/regexSupplant';
import validCCTLD from './validCCTLD';
import validDomainName from './validDomainName';

const invalidShortDomain = regexSupplant(/^#{validDomainName}#{validCCTLD}$/i, { validDomainName, validCCTLD });

export default invalidShortDomain;
