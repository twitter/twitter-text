import regexSupplant from '../lib/regexSupplant';
import spacesGroup from './spacesGroup';
export default regexSupplant(/[#{spacesGroup}]/, { spacesGroup });
