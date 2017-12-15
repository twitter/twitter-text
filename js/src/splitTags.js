
// this essentially does text.split(/<|>/)
// except that won't work in IE, where empty strings are ommitted
// so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
// but "<<".split("<") => ["", "", ""]
export default function (text) {
  let firstSplits = text.split('<'),
    secondSplits,
    allSplits = [],
    split;

  for (let i = 0; i < firstSplits.length; i += 1) {
    split = firstSplits[i];
    if (!split) {
      allSplits.push('');
    } else {
      secondSplits = split.split('>');
      for (let j = 0; j < secondSplits.length; j += 1) {
        allSplits.push(secondSplits[j]);
      }
    }
  }

  return allSplits;
}
