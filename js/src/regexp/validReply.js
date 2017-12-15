import atSigns from './atSigns';
import regexSupplant from '../lib/regexSupplant';
import spaces from './spaces';

const validReply = regexSupplant(
  /^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/,
  { atSigns, spaces }
);

export default validReply;
