import invalidCharsGroup from './invalidCharsGroup';
import regexSupplant from '../lib/regexSupplant';
const invalidChars = regexSupplant(/[#{invalidCharsGroup}]/, { invalidCharsGroup });
export default invalidChars;
