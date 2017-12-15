import extractCashtagsWithIndices from './extractCashtagsWithIndices';

export default function (text) {
  const cashtagsOnly = [],
    cashtagsWithIndices = extractCashtagsWithIndices(text);

  for (let i = 0; i < cashtagsWithIndices.length; i++) {
    cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
  }

  return cashtagsOnly;
}
