import atSigns from './atSigns';
import latinAccentChars from './latinAccentChars';
import regexSupplant from '../lib/regexSupplant';
const endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/, { atSigns, latinAccentChars });
export default endMentionMatch;
