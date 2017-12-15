import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function (text, options) {
  const entities = extractMentionsOrListsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
