import endMentionMatch from './regexp/endMentionMatch';
import validReply from './regexp/validReply';

export default function (text) {
  if (!text) {
    return null;
  }

  const possibleScreenName = text.match(validReply);
  if (!possibleScreenName ||
      RegExp.rightContext.match(endMentionMatch)) {
    return null;
  }

  return possibleScreenName[1];
}
