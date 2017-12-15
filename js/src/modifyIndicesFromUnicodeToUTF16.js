import convertUnicodeIndices from './lib/convertUnicodeIndices';

export default function (text, entities) {
  convertUnicodeIndices(text, entities, false);
}
