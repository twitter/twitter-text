import extractHashtagsWithIndices from './extractHashtagsWithIndices';

export default function (text) {
  const hashtagsOnly = [];
  const hashtagsWithIndices = extractHashtagsWithIndices(text);
  for (let i = 0; i < hashtagsWithIndices.length; i++) {
    hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
  }

  return hashtagsOnly;
}
