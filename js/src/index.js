// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import autoLink from './autoLink';
import autoLinkCashtags from './autoLinkCashtags';
import autoLinkEntities from './autoLinkEntities';
import autoLinkHashtags from './autoLinkHashtags';
import autoLinkUrlsCustom from './autoLinkUrlsCustom';
import autoLinkUsernamesOrLists from './autoLinkUsernamesOrLists';
import autoLinkWithJSON from './autoLinkWithJSON';
import configs from './configs';
import convertUnicodeIndices from './convertUnicodeIndices';
import extractCashtags from './extractCashtags';
import extractCashtagsWithIndices from './extractCashtagsWithIndices';
import extractEntitiesWithIndices from './extractEntitiesWithIndices';
import extractHashtags from './extractHashtags';
import extractHashtagsWithIndices from './extractHashtagsWithIndices';
import extractHtmlAttrsFromOptions from './extractHtmlAttrsFromOptions';
import extractMentions from './extractMentions';
import extractMentionsOrListsWithIndices from './extractMentionsOrListsWithIndices';
import extractMentionsWithIndices from './extractMentionsWithIndices';
import extractReplies from './extractReplies';
import extractUrls from './extractUrls';
import extractUrlsWithIndices from './extractUrlsWithIndices';
import getTweetLength from './getTweetLength';
import getUnicodeTextLength from './getUnicodeTextLength';
import hasInvalidCharacters from './hasInvalidCharacters';
import hitHighlight from './hitHighlight';
import htmlEscape from './htmlEscape';
import isInvalidTweet from './isInvalidTweet';
import isValidHashtag from './isValidHashtag';
import isValidList from './isValidList';
import isValidTweetText from './isValidTweetText';
import isValidUrl from './isValidUrl';
import isValidUsername from './isValidUsername';
import linkTextWithEntity from './linkTextWithEntity';
import linkToCashtag from './linkToCashtag';
import linkToHashtag from './linkToHashtag';
import linkToMentionAndList from './linkToMentionAndList';
import linkToText from './linkToText';
import linkToTextWithSymbol from './linkToTextWithSymbol';
import linkToUrl from './linkToUrl';
import modifyIndicesFromUTF16ToUnicode from './modifyIndicesFromUTF16ToUnicode';
import modifyIndicesFromUnicodeToUTF16 from './modifyIndicesFromUnicodeToUTF16';
import regexen from './regexp/index';
import removeOverlappingEntities from './removeOverlappingEntities';
import parseTweet from './parseTweet';
import splitTags from './splitTags';
import standardizeIndices from './standardizeIndices';
import tagAttrs from './tagAttrs';

export default {
  autoLink,
  autoLinkCashtags,
  autoLinkEntities,
  autoLinkHashtags,
  autoLinkUrlsCustom,
  autoLinkUsernamesOrLists,
  autoLinkWithJSON,
  configs,
  convertUnicodeIndices,
  extractCashtags,
  extractCashtagsWithIndices,
  extractEntitiesWithIndices,
  extractHashtags,
  extractHashtagsWithIndices,
  extractHtmlAttrsFromOptions,
  extractMentions,
  extractMentionsOrListsWithIndices,
  extractMentionsWithIndices,
  extractReplies,
  extractUrls,
  extractUrlsWithIndices,
  getTweetLength,
  getUnicodeTextLength,
  hasInvalidCharacters,
  hitHighlight,
  htmlEscape,
  isInvalidTweet,
  isValidHashtag,
  isValidList,
  isValidTweetText,
  isValidUrl,
  isValidUsername,
  linkTextWithEntity,
  linkToCashtag,
  linkToHashtag,
  linkToMentionAndList,
  linkToText,
  linkToTextWithSymbol,
  linkToUrl,
  modifyIndicesFromUTF16ToUnicode,
  modifyIndicesFromUnicodeToUTF16,
  regexen,
  removeOverlappingEntities,
  parseTweet,
  splitTags,
  standardizeIndices,
  tagAttrs
};
