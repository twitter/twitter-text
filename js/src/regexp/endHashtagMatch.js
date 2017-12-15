import hashSigns from './hashSigns';
import regexSupplant from '../lib/regexSupplant';

const endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/, { hashSigns });

export default endHashtagMatch;
