import getUnicodeTextLength from './getUnicodeTextLength';

export default function standardizeIndices(text, startIndex, endIndex) {
  const totalUnicodeTextLength = getUnicodeTextLength(text);
  const encodingDiff = text.length - totalUnicodeTextLength;
  if (encodingDiff > 0) {
    // split the string into codepoints which will map to the API's indices
    const byCodePair = Array.from(text);
    const beforeText = startIndex === 0 ? '' : byCodePair.slice(0, startIndex).join('');
    const actualText = byCodePair.slice(startIndex, endIndex).join('');
    return [beforeText.length, beforeText.length + actualText.length];
  }
  return [startIndex, endIndex];
}
