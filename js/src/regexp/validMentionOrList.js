import atSigns from './atSigns';
import regexSupplant from '../lib/regexSupplant';
import validMentionPrecedingChars from './validMentionPrecedingChars';

const validMentionOrList = regexSupplant(
  '(#{validMentionPrecedingChars})' +  // $1: Preceding character
  '(#{atSigns})' +                     // $2: At mark
  '([a-zA-Z0-9_]{1,20})' +             // $3: Screen name
  '(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?',  // $4: List (optional)
  { validMentionPrecedingChars, atSigns },
  'g'
);

export default validMentionOrList;
