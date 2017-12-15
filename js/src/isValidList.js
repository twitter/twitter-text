import regexSupplant from './lib/regexSupplant';
import validMentionOrList from './regexp/validMentionOrList';

const VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/, { validMentionOrList });

export default function (usernameList) {
  const match = usernameList.match(VALID_LIST_RE);

  // Must have matched and had nothing before or after
  return !!(match && match[1] == '' && match[4]);
}
