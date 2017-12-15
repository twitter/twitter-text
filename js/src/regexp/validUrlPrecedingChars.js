import invalidCharsGroup from './invalidCharsGroup';
import regexSupplant from '../lib/regexSupplant';
const validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalidCharsGroup}]|^)/, { invalidCharsGroup });
export default validUrlPrecedingChars;

