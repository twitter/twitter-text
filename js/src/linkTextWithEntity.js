// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import htmlEscape from './htmlEscape';
import stringSupplant from './lib/stringSupplant';

export default function(entity, options) {
  const displayUrl = entity.display_url;
  const expandedUrl = entity.expanded_url;

  // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
  // should contain the full original URL (expanded_url), not the display URL.
  //
  // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
  // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
  // Elements with font-size:0 get copied even though they are not visible.
  // Note that display:none doesn't work here. Elements with display:none don't get copied.
  //
  // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
  // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
  // everything with the tco-ellipsis class.
  //
  // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
  // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
  // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.

  const displayUrlSansEllipses = displayUrl.replace(/…/g, ''); // We have to disregard ellipses for matching
  // Note: we currently only support eliding parts of the URL at the beginning or the end.
  // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
  // become more complicated.  We will probably want to create a regexp out of display URL,
  // replacing every ellipsis with a ".*".
  if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
    const displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
    const v = {
      displayUrlSansEllipses: displayUrlSansEllipses,
      // Portion of expandedUrl that precedes the displayUrl substring
      beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
      // Portion of expandedUrl that comes after displayUrl
      afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
      precedingEllipsis: displayUrl.match(/^…/) ? '…' : '',
      followingEllipsis: displayUrl.match(/…$/) ? '…' : ''
    };
    for (const k in v) {
      if (v.hasOwnProperty(k)) {
        v[k] = htmlEscape(v[k]);
      }
    }
    // As an example: The user tweets "hi http://longdomainname.com/foo"
    // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
    // This will get rendered as:
    // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
    //   …
    //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
    //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
    //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
    //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
    //        e.g. "hi  http://longdomainname.com/foo".
    //   <span style='font-size:0'>&nbsp;</span>
    // </span>
    // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
    //   http://longdomai
    // </span>
    // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
    //   nname.com/foo
    // </span>
    // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
    //   <span style='font-size:0'>&nbsp;</span>
    //   …
    // </span>
    v['invisible'] = options.invisibleTagAttrs;
    return stringSupplant(
      "<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>",
      v
    );
  }
  return displayUrl;
}
