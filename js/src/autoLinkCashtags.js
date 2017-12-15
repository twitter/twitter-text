
import autoLinkEntities from './autoLinkEntities';
import extractCashtagsWithIndices from './extractCashtagsWithIndices';

export default function (text, options) {
  const entities = extractCashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
}
