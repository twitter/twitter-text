// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const getCharacterWeight = function(ch, options) {
  const { defaultWeight, ranges } = options;
  let weight = defaultWeight;
  const chCodePoint = ch.charCodeAt(0);
  if (Array.isArray(ranges)) {
    for (let i = 0, length = ranges.length; i < length; i++) {
      const currRange = ranges[i];
      if (chCodePoint >= currRange.start && chCodePoint <= currRange.end) {
        weight = currRange.weight;
        break;
      }
    }
  }

  return weight;
};

export default getCharacterWeight;
