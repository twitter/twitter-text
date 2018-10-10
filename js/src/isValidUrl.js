// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import validateUrlAuthority from './regexp/validateUrlAuthority';
import validateUrlFragment from './regexp/validateUrlFragment';
import validateUrlPath from './regexp/validateUrlPath';
import validateUrlQuery from './regexp/validateUrlQuery';
import validateUrlScheme from './regexp/validateUrlScheme';
import validateUrlUnencoded from './regexp/validateUrlUnencoded';
import validateUrlUnicodeAuthority from './regexp/validateUrlUnicodeAuthority';

function isValidMatch(string, regex, optional) {
  if (!optional) {
    // RegExp["$&"] is the text of the last match
    // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
    return typeof string === 'string' && string.match(regex) && RegExp['$&'] === string;
  }

  // RegExp["$&"] is the text of the last match
  return !string || (string.match(regex) && RegExp['$&'] === string);
}

export default function(url, unicodeDomains, requireProtocol) {
  if (unicodeDomains == null) {
    unicodeDomains = true;
  }

  if (requireProtocol == null) {
    requireProtocol = true;
  }

  if (!url) {
    return false;
  }

  const urlParts = url.match(validateUrlUnencoded);

  if (!urlParts || urlParts[0] !== url) {
    return false;
  }

  let scheme = urlParts[1],
    authority = urlParts[2],
    path = urlParts[3],
    query = urlParts[4],
    fragment = urlParts[5];

  if (
    !(
      (!requireProtocol || (isValidMatch(scheme, validateUrlScheme) && scheme.match(/^https?$/i))) &&
      isValidMatch(path, validateUrlPath) &&
      isValidMatch(query, validateUrlQuery, true) &&
      isValidMatch(fragment, validateUrlFragment, true)
    )
  ) {
    return false;
  }

  return (
    (unicodeDomains && isValidMatch(authority, validateUrlUnicodeAuthority)) ||
    (!unicodeDomains && isValidMatch(authority, validateUrlAuthority))
  );
}
