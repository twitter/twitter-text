import invalidDomainChars from './invalidDomainChars';
import regexSupplant from '../lib/regexSupplant';

const validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/, { invalidDomainChars });

export default validDomainChars;
