import extractHashtagsWithIndices from './extractHashtagsWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function (text, options) {
  const entities = extractHashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
