// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import atSigns from './regexp/atSigns';
import endMentionMatch from './regexp/endMentionMatch';
import validMentionOrList from './regexp/validMentionOrList';

export default function(text) {
  if (!text || !text.match(atSigns)) {
    return [];
  }

  const possibleNames = [];

  text.replace(validMentionOrList, function(match, before, atSign, screenName, slashListname, offset, chunk) {
    const after = chunk.slice(offset + match.length);
    if (!after.match(endMentionMatch)) {
      slashListname = slashListname || '';
      const startPosition = offset + before.length;
      const endPosition = startPosition + screenName.length + slashListname.length + 1;
      possibleNames.push({
        screenName: screenName,
        listSlug: slashListname,
        indices: [startPosition, endPosition]
      });
    }
  });

  return possibleNames;
}
