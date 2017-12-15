
import extractCashtagsWithIndices from './extractCashtagsWithIndices';
import extractHashtagsWithIndices from './extractHashtagsWithIndices';
import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';
import extractUrlsWithIndices from './extractUrlsWithIndices';
import removeOverlappingEntities from './removeOverlappingEntities';

export default function (text, options) {
  const entities = extractUrlsWithIndices(text, options)
                  .concat(extractMentionsOrListsWithIndices(text))
                  .concat(extractHashtagsWithIndices(text, { checkUrlOverlap: false }))
                  .concat(extractCashtagsWithIndices(text));

  if (entities.length == 0) {
    return [];
  }

  removeOverlappingEntities(entities);
  return entities;
}
