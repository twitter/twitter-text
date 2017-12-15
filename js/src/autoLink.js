import extractEntitiesWithIndices from './extractEntitiesWithIndices';
import autoLinkEntities from './autoLinkEntities';

export default function (text, options) {
  const entities = extractEntitiesWithIndices(text, { extractUrlsWithoutProtocol: false });
  return autoLinkEntities(text, entities, options);
}
