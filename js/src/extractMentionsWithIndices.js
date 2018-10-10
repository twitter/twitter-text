// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';

export default function(text) {
  const mentions = [];
  let mentionOrList;
  const mentionsOrLists = extractMentionsOrListsWithIndices(text);

  for (let i = 0; i < mentionsOrLists.length; i++) {
    mentionOrList = mentionsOrLists[i];
    if (mentionOrList.listSlug === '') {
      mentions.push({
        screenName: mentionOrList.screenName,
        indices: mentionOrList.indices
      });
    }
  }

  return mentions;
}
