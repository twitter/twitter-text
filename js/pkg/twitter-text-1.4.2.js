/*!
 * twitter-text-js 1.4.2
 *
 * Copyright 2010 Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

if (!window.twttr) {
  window.twttr = {};
}

(function() {
  twttr.txt = {};
  twttr.txt.regexen = {};

  var HTML_ENTITIES = {
    '&': '&amp;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#32;'
  };

  // HTML escaping
  twttr.txt.htmlEscape = function(text) {
    return text && text.replace(/[&"'><]/g, function(character) {
      return HTML_ENTITIES[character];
    });
  };

  // Builds a RegExp
  function regexSupplant(regex, flags) {
    flags = flags || "";
    if (typeof regex !== "string") {
      if (regex.global && flags.indexOf("g") < 0) {
        flags += "g";
      }
      if (regex.ignoreCase && flags.indexOf("i") < 0) {
        flags += "i";
      }
      if (regex.multiline && flags.indexOf("m") < 0) {
        flags += "m";
      }

      regex = regex.source;
    }

    return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
      var newRegex = twttr.txt.regexen[name] || "";
      if (typeof newRegex !== "string") {
        newRegex = newRegex.source;
      }
      return newRegex;
    }), flags);
  }

  // simple string interpolation
  function stringSupplant(str, values) {
    return str.replace(/#\{(\w+)\}/g, function(match, name) {
      return values[name] || "";
    });
  }

  // Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
  // to access both the list of characters and a pattern suitible for use with String#split
  // Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
  var fromCode = String.fromCharCode;
  var UNICODE_SPACES = [
    fromCode(0x0020), // White_Space # Zs       SPACE
    fromCode(0x0085), // White_Space # Cc       <control-0085>
    fromCode(0x00A0), // White_Space # Zs       NO-BREAK SPACE
    fromCode(0x1680), // White_Space # Zs       OGHAM SPACE MARK
    fromCode(0x180E), // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
    fromCode(0x2028), // White_Space # Zl       LINE SEPARATOR
    fromCode(0x2029), // White_Space # Zp       PARAGRAPH SEPARATOR
    fromCode(0x202F), // White_Space # Zs       NARROW NO-BREAK SPACE
    fromCode(0x205F), // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
    fromCode(0x3000)  // White_Space # Zs       IDEOGRAPHIC SPACE
  ];

  for (var i = 0x009; i <= 0x000D; i++) { // White_Space # Cc   [5] <control-0009>..<control-000D>
    UNICODE_SPACES.push(String.fromCharCode(i));
  }

  for (var i = 0x2000; i <= 0x200A; i++) { // White_Space # Zs  [11] EN QUAD..HAIR SPACE
    UNICODE_SPACES.push(String.fromCharCode(i));
  }

  twttr.txt.regexen.spaces = regexSupplant("[" + UNICODE_SPACES.join("") + "]");
  twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~/;
  twttr.txt.regexen.atSigns = /[@＠]/;
  twttr.txt.regexen.extractMentions = regexSupplant(/(^|[^a-zA-Z0-9_])(#{atSigns})([a-zA-Z0-9_]{1,20})(?=(.|$))/g);
  twttr.txt.regexen.extractReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
  twttr.txt.regexen.listName = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/;

  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
  twttr.txt.regexen.latinAccentChars = regexSupplant("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ\\303\\277");
  twttr.txt.regexen.latenAccents = regexSupplant(/[#{latinAccentChars}]+/);

  twttr.txt.regexen.endScreenNameMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);

  // A hashtag must contain latin characters, numbers and underscores, but not all numbers.
  twttr.txt.regexen.hashtagAlpha = regexSupplant(/[a-z_#{latinAccentChars}]/i);
  twttr.txt.regexen.hashtagAlphaNumeric = regexSupplant(/[a-z0-9_#{latinAccentChars}]/i);
  twttr.txt.regexen.autoLinkHashtags = regexSupplant(/(^|[^0-9A-Z&\/\?]+)(#|＃)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);
  twttr.txt.regexen.autoLinkUsernamesOrLists = /(^|[^a-zA-Z0-9_]|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?/g;
  twttr.txt.regexen.autoLinkEmoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/g;

  // URL related hash regex collection
  twttr.txt.regexen.validPrecedingChars = regexSupplant(/(?:[^-\/"':!=A-Za-z0-9_@＠]|^|\:)/);

  twttr.txt.regexen.validSubdomain = regexSupplant(/([^#{punct}\s]([_-]|[^#{punct}\s])*)?[^#{punct}\s]\./);
  twttr.txt.regexen.validDomainName = regexSupplant(/([^#{punct}\s]([-]|[^#{punct}\s])*)?[^#{punct}\s]/);
  twttr.txt.regexen.validDomain = regexSupplant(/(#{validSubdomain})*#{validDomainName}\.[a-z]{2,}(?::[0-9]+)?/i);

  twttr.txt.regexen.validGeneralUrlPathChars = /[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~|]/i;
  // Allow URL paths to contain balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  twttr.txt.regexen.wikipediaDisambiguation = regexSupplant(/(?:\(#{validGeneralUrlPathChars}+\))/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
  twttr.txt.regexen.validUrlPathChars = regexSupplant(/(?:#{wikipediaDisambiguation}|@#{validGeneralUrlPathChars}+\/|[\.,]?#{validGeneralUrlPathChars})/i);

  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/(?:[\+\-a-z0-9=_#\/]|#{wikipediaDisambiguation})/i);
  twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
  twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
  twttr.txt.regexen.extractUrl = regexSupplant(
    '('                                                            + // $1 total match
      '(#{validPrecedingChars})'                                   + // $2 Preceeding chracter
      '('                                                          + // $3 URL
        '(https?:\\/\\/)'                                          + // $4 Protocol
        '(#{validDomain})'                                         + // $5 Domain(s) and optional post number
        '(\\/'                                                     + // $6 URL Path
           '(?:'                                                   +
             '#{validUrlPathChars}+#{validUrlPathEndingChars}|'    +
             '#{validUrlPathChars}+#{validUrlPathEndingChars}?|'   +
             '#{validUrlPathEndingChars}'                          +
           ')?'                                                    +
        ')?'                                                       +
        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $7 Query String
      ')'                                                          +
    ')'
  , "gi");


  // These URL validation pattern strings are based on the ABNF from RFC 3986
  twttr.txt.regexen.validateUrlUnreserved = /[a-z0-9\-._~]/i;
  twttr.txt.regexen.validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;
  twttr.txt.regexen.validateUrlSubDelims = /[!$&'()*+,;=]/i;
  twttr.txt.regexen.validateUrlPchar = regexSupplant('(?:' +
    '#{validateUrlUnreserved}|' +
    '#{validateUrlPctEncoded}|' +
    '#{validateUrlSubDelims}|' +
    ':|@' +
  ')', 'i');

  twttr.txt.regexen.validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;
  twttr.txt.regexen.validateUrlUserinfo = regexSupplant('(?:' +
    '#{validateUrlUnreserved}|' +
    '#{validateUrlPctEncoded}|' +
    '#{validateUrlSubDelims}|' +
    ':' +
  ')*', 'i');

  twttr.txt.regexen.validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;
  twttr.txt.regexen.validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i);

  // Punting on real IPv6 validation for now
  twttr.txt.regexen.validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;

  // Also punting on IPvFuture for now
  twttr.txt.regexen.validateUrlIp = regexSupplant('(?:' +
    '#{validateUrlIpv4}|' +
    '#{validateUrlIpv6}' +
  ')', 'i');

  // This is more strict than the rfc specifies
  twttr.txt.regexen.validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;
  twttr.txt.regexen.validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;
  twttr.txt.regexen.validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;
  twttr.txt.regexen.validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment]}\.)*(?:#{validateUrlDomainSegment]}\.)#{validateUrlDomainTld})/i);

  twttr.txt.regexen.validateUrlHost = regexSupplant('(?:' +
    '#{validateUrlIp}|' +
    '#{validateUrlDomain}' +
  ')', 'i');

  // Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
  twttr.txt.regexen.validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
  twttr.txt.regexen.validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
  twttr.txt.regexen.validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
  twttr.txt.regexen.validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i);

  twttr.txt.regexen.validateUrlUnicodeHost = regexSupplant('(?:' +
    '#{validateUrlIp}|' +
    '#{validateUrlUnicodeDomain}' +
  ')', 'i');

  twttr.txt.regexen.validateUrlPort = /[0-9]{1,5}/;

  twttr.txt.regexen.validateUrlUnicodeAuthority = regexSupplant(
    '(?:(#{validateUrlUserinfo})@)?'  + // $1 userinfo
    '(#{validateUrlUnicodeHost})'     + // $2 host
    '(?::(#{validateUrlPort}))?'        //$3 port
  , "i");

  twttr.txt.regexen.validateUrlAuthority = regexSupplant(
    '(?:(#{validateUrlUserinfo})@)?' + // $1 userinfo
    '(#{validateUrlHost})'           + // $2 host
    '(?::(#{validateUrlPort}))?'       // $3 port
  , "i");

  twttr.txt.regexen.validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i);
  twttr.txt.regexen.validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);
  twttr.txt.regexen.validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);

  // Modified version of RFC 3986 Appendix B
  twttr.txt.regexen.validateUrlUnencoded = regexSupplant(
    '^'                               + // Full URL
    '(?:'                             +
      '([^:/?#]+):'                   + // $1 Scheme
    ')'                               +
    '(?://'                           +
      '([^/?#]*)'                     + // $2 Authority
    ')'                               +
    '([^?#]*)'                        + // $3 Path
    '(?:'                             +
      '\\?([^#]*)'                    + // $4 Query
    ')?'                              +
    '(?:'                             +
      '#(.*)'                         + // $5 Fragment
    ')?$'
  , "i");


  // Default CSS class for auto-linked URLs
  var DEFAULT_URL_CLASS = "tweet-url";
  // Default CSS class for auto-linked lists (along with the url class)
  var DEFAULT_LIST_CLASS = "list-slug";
  // Default CSS class for auto-linked usernames (along with the url class)
  var DEFAULT_USERNAME_CLASS = "username";
  // Default CSS class for auto-linked hashtags (along with the url class)
  var DEFAULT_HASHTAG_CLASS = "hashtag";
  // HTML attribute for robot nofollow behavior (default)
  var HTML_ATTR_NO_FOLLOW = " rel=\"nofollow\"";

  // Simple object cloning function for simple objects
  function clone(o) {
    var r = {};
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        r[k] = o[k];
      }
    }

    return r;
  }

  twttr.txt.autoLink = function(text, options) {
    options = clone(options || {});
    return twttr.txt.autoLinkUsernamesOrLists(
      twttr.txt.autoLinkUrlsCustom(
        twttr.txt.autoLinkHashtags(text, options),
      options),
    options);
  };


  twttr.txt.autoLinkUsernamesOrLists = function(text, options) {
    options = clone(options || {});

    options.urlClass = options.urlClass || DEFAULT_URL_CLASS;
    options.listClass = options.listClass || DEFAULT_LIST_CLASS;
    options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
    options.usernameUrlBase = options.usernameUrlBase || "http://twitter.com/";
    options.listUrlBase = options.listUrlBase || "http://twitter.com/";
    if (!options.suppressNoFollow) {
      var extraHtml = HTML_ATTR_NO_FOLLOW;
    }

    var newText = "",
        splitText = twttr.txt.splitTags(text);

    for (var index = 0; index < splitText.length; index++) {
      var chunk = splitText[index];

      if (index !== 0) {
        newText += ((index % 2 === 0) ? ">" : "<");
      }

      if (index % 4 !== 0) {
        newText += chunk;
      } else {
        newText += chunk.replace(twttr.txt.regexen.autoLinkUsernamesOrLists, function(match, before, at, user, slashListname, offset, chunk) {
          var after = chunk.slice(offset + match.length);

          var d = {
            before: before,
            at: at,
            user: twttr.txt.htmlEscape(user),
            slashListname: twttr.txt.htmlEscape(slashListname),
            extraHtml: extraHtml,
            preChunk: "",
            chunk: twttr.txt.htmlEscape(chunk),
            postChunk: ""
          };
          for (var k in options) {
            if (options.hasOwnProperty(k)) {
              d[k] = options[k];
            }
          }

          if (slashListname && !options.suppressLists) {
            // the link is a list
            var list = d.chunk = stringSupplant("#{user}#{slashListname}", d);
            d.list = twttr.txt.htmlEscape(list.toLowerCase());
            return stringSupplant("#{before}#{at}<a class=\"#{urlClass} #{listClass}\" href=\"#{listUrlBase}#{list}\"#{extraHtml}>#{chunk}</a>", d);
          } else {
            if (after && after.match(twttr.txt.regexen.endScreenNameMatch)) {
              // Followed by something that means we don't autolink
              return match;
            } else {
              // this is a screen name
              d.chunk = twttr.txt.htmlEscape(user);
              d.dataScreenName = !options.suppressDataScreenName ? stringSupplant("data-screen-name=\"#{chunk}\" ", d) : "";
              return stringSupplant("#{before}#{at}<a class=\"#{urlClass} #{usernameClass}\" #{dataScreenName}href=\"#{usernameUrlBase}#{chunk}\"#{extraHtml}>#{preChunk}#{chunk}#{postChunk}</a>", d);
            }
          }
        });
      }
    }

    return newText;
  };

  twttr.txt.autoLinkHashtags = function(text, options) {
    options = clone(options || {});
    options.urlClass = options.urlClass || DEFAULT_URL_CLASS;
    options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
    options.hashtagUrlBase = options.hashtagUrlBase || "http://twitter.com/search?q=%23";
    if (!options.suppressNoFollow) {
      var extraHtml = HTML_ATTR_NO_FOLLOW;
    }

    return text.replace(twttr.txt.regexen.autoLinkHashtags, function(match, before, hash, text) {
      var d = {
        before: before,
        hash: twttr.txt.htmlEscape(hash),
        preText: "",
        text: twttr.txt.htmlEscape(text),
        postText: "",
        extraHtml: extraHtml
      };

      for (var k in options) {
        if (options.hasOwnProperty(k)) {
          d[k] = options[k];
        }
      }

      return stringSupplant("#{before}<a href=\"#{hashtagUrlBase}#{text}\" title=\"##{text}\" class=\"#{urlClass} #{hashtagClass}\"#{extraHtml}>#{hash}#{preText}#{text}#{postText}</a>", d);
    });
  };


  twttr.txt.autoLinkUrlsCustom = function(text, options) {
    options = clone(options || {});
    if (!options.suppressNoFollow) {
      options.rel = "nofollow";
    }
    if (options.urlClass) {
      options["class"] = options.urlClass;
      delete options.urlClass;
    }

    delete options.suppressNoFollow;
    delete options.suppressDataScreenName;

    return text.replace(twttr.txt.regexen.extractUrl, function(match, all, before, url, protocol, domain, path, queryString) {
      var tldComponents;

      if (protocol) {
        var htmlAttrs = "";
        for (var k in options) {
          htmlAttrs += stringSupplant(" #{k}=\"#{v}\" ", {k: k, v: options[k].toString().replace(/"/, "&quot;").replace(/</, "&lt;").replace(/>/, "&gt;")});
        }
        options.htmlAttrs || "";

        var d = {
          before: before,
          htmlAttrs: htmlAttrs,
          url: twttr.txt.htmlEscape(url)
        };

        return stringSupplant("#{before}<a href=\"#{url}\"#{htmlAttrs}>#{url}</a>", d);
      } else {
        return all;
      }
    });
  };

  twttr.txt.extractMentions = function(text) {
    var screenNamesOnly = [],
        screenNamesWithIndices = twttr.txt.extractMentionsWithIndices(text);

    for (var i = 0; i < screenNamesWithIndices.length; i++) {
      var screenName = screenNamesWithIndices[i].screenName;
      screenNamesOnly.push(screenName);
    }

    return screenNamesOnly;
  };

  twttr.txt.extractMentionsWithIndices = function(text) {
    if (!text) {
      return [];
    }

    var possibleScreenNames = [],
        position = 0;

    text.replace(twttr.txt.regexen.extractMentions, function(match, before, atSign, screenName, after) {
      if (!after.match(twttr.txt.regexen.endScreenNameMatch)) {
        var startPosition = text.indexOf(atSign + screenName, position);
        position = startPosition + screenName.length + 1;
        possibleScreenNames.push({
          screenName: screenName,
          indices: [startPosition, position]
        });
      }
    });

    return possibleScreenNames;
  };

  twttr.txt.extractReplies = function(text) {
    if (!text) {
      return null;
    }

    var possibleScreenName = text.match(twttr.txt.regexen.extractReply);
    if (!possibleScreenName) {
      return null;
    }

    return possibleScreenName[1];
  };

  twttr.txt.extractUrls = function(text) {
    var urlsOnly = [],
        urlsWithIndices = twttr.txt.extractUrlsWithIndices(text);

    for (var i = 0; i < urlsWithIndices.length; i++) {
      urlsOnly.push(urlsWithIndices[i].url);
    }

    return urlsOnly;
  };

  twttr.txt.extractUrlsWithIndices = function(text) {
    if (!text) {
      return [];
    }

    var urls = [],
        position = 0;

    text.replace(twttr.txt.regexen.extractUrl, function(match, all, before, url, protocol, domain, path, query) {
      var tldComponents;

      if (protocol) {
        var startPosition = text.indexOf(url, position),
            position = startPosition + url.length;

        urls.push({
          url: url,
          indices: [startPosition, position]
        });
      }
    });

    return urls;
  };

  twttr.txt.extractHashtags = function(text) {
    var hashtagsOnly = [],
        hashtagsWithIndices = twttr.txt.extractHashtagsWithIndices(text);

    for (var i = 0; i < hashtagsWithIndices.length; i++) {
      hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
    }

    return hashtagsOnly;
  };

  twttr.txt.extractHashtagsWithIndices = function(text) {
    if (!text) {
      return [];
    }

    var tags = [],
        position = 0;

    text.replace(twttr.txt.regexen.autoLinkHashtags, function(match, before, hash, hashText) {
      var startPosition = text.indexOf(hash + hashText, position);
      position = startPosition + hashText.length + 1;
      tags.push({
        hashtag: hashText,
        indices: [startPosition, position]
      });
    });

    return tags;
  };

  // this essentially does text.split(/<|>/)
  // except that won't work in IE, where empty strings are ommitted
  // so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
  // but "<<".split("<") => ["", "", ""]
  twttr.txt.splitTags = function(text) {
    var firstSplits = text.split("<"),
        secondSplits,
        allSplits = [],
        split;

    for (var i = 0; i < firstSplits.length; i += 1) {
      split = firstSplits[i];
      if (!split) {
        allSplits.push("");
      } else {
        secondSplits = split.split(">");
        for (var j = 0; j < secondSplits.length; j += 1) {
          allSplits.push(secondSplits[j]);
        }
      }
    }

    return allSplits;
  };

  twttr.txt.hitHighlight = function(text, hits, options) {
    var defaultHighlightTag = "em";

    hits = hits || [];
    options = options || {};

    if (hits.length === 0) {
      return text;
    }

    var tagName = options.tag || defaultHighlightTag,
        tags = ["<" + tagName + ">", "</" + tagName + ">"],
        chunks = twttr.txt.splitTags(text),
        split,
        i,
        j,
        result = "",
        chunkIndex = 0,
        chunk = chunks[0],
        prevChunksLen = 0,
        chunkCursor = 0,
        startInChunk = false,
        chunkChars = chunk,
        flatHits = [],
        index,
        hit,
        tag,
        placed,
        hitSpot;

    for (i = 0; i < hits.length; i += 1) {
      for (j = 0; j < hits[i].length; j += 1) {
        flatHits.push(hits[i][j]);
      }
    }

    for (index = 0; index < flatHits.length; index += 1) {
      hit = flatHits[index];
      tag = tags[index % 2];
      placed = false;

      while (chunk != null && hit >= prevChunksLen + chunk.length) {
        result += chunkChars.slice(chunkCursor);
        if (startInChunk && hit === prevChunksLen + chunkChars.length) {
          result += tag;
          placed = true;
        }

        if (chunks[chunkIndex + 1]) {
          result += "<" + chunks[chunkIndex + 1] + ">";
        }

        prevChunksLen += chunkChars.length;
        chunkCursor = 0;
        chunkIndex += 2;
        chunk = chunks[chunkIndex];
        chunkChars = chunk;
        startInChunk = false;
      }

      if (!placed && chunk != null) {
        hitSpot = hit - prevChunksLen;
        result += chunkChars.slice(chunkCursor, hitSpot) + tag;
        chunkCursor = hitSpot;
        if (index % 2 === 0) {
          startInChunk = true;
        } else {
          startInChunk = false;
        }
      } else if(!placed) {
        placed = true;
        result += tag;
      }
    }

    if (chunk != null) {
      if (chunkCursor < chunkChars.length) {
        result += chunkChars.slice(chunkCursor);
      }
      for (index = chunkIndex + 1; index < chunks.length; index += 1) {
        result += (index % 2 === 0 ? chunks[index] : "<" + chunks[index] + ">");
      }
    }

    return result;
  };

  var MAX_LENGTH = 140;

  // Characters not allowed in Tweets
  var INVALID_CHARACTERS = [
    // BOM
    fromCode(0xFFFE),
    fromCode(0xFEFF),

    // Special
    fromCode(0xFFFF),

    // Directional Change
    fromCode(0x202A),
    fromCode(0x202B),
    fromCode(0x202C),
    fromCode(0x202D),
    fromCode(0x202E)
  ];

  // Check the text for any reason that it may not be valid as a Tweet. This is meant as a pre-validation
  // before posting to api.twitter.com. There are several server-side reasons for Tweets to fail but this pre-validation
  // will allow quicker feedback.
  //
  // Returns false if this text is valid. Otherwise one of the following strings will be returned:
  //
  //   "too_long": if the text is too long
  //   "empty": if the text is nil or empty
  //   "invalid_characters": if the text contains non-Unicode or any of the disallowed Unicode characters
  twttr.txt.isInvalidTweet = function(text) {
    if (!text) {
      return "empty";
    }

    if (text.length > MAX_LENGTH) {
      return "too_long";
    }

    for (var i = 0; i < INVALID_CHARACTERS.length; i++) {
      if (text.indexOf(INVALID_CHARACTERS[i]) >= 0) {
        return "invalid_characters";
      }
    }

    return false
  };

  twttr.txt.isValidTweetText = function(text) {
    return !twttr.txt.isInvalidTweet(text);
  };

  twttr.txt.isValidUsername = function(username) {
    if (!username) {
      return false;
    }

    var extracted = twttr.txt.extractMentions(username);

    // Should extract the username minus the @ sign, hence the .slice(1)
    return extracted.length === 1 && extracted[0] === username.slice(1);
  };

  var VALID_LIST_RE = regexSupplant(/^#{autoLinkUsernamesOrLists}$/);

  twttr.txt.isValidList = function(usernameList) {
    var match = usernameList.match(VALID_LIST_RE);

    // Must have matched and had nothing before or after
    return !!(match && match[1] == "" && match[4]);
  };

  twttr.txt.isValidHashtag = function(hashtag) {
    if (!hashtag) {
      return false;
    }

    var extracted = twttr.txt.extractHashtags(hashtag);

    // Should extract the hashtag minus the # sign, hence the .slice(1)
    return extracted.length === 1 && extracted[0] === hashtag.slice(1);
  };

  twttr.txt.isValidUrl = function(url, unicodeDomains) {
    if (unicodeDomains == null) {
      unicodeDomains = true;
    }

    if (!url) {
      return false;
    }

    var urlParts = url.match(twttr.txt.regexen.validateUrlUnencoded);

    if (!urlParts || urlParts[0] !== url) {
      return false;
    }

    var scheme = urlParts[1],
        authority = urlParts[2],
        path = urlParts[3],
        query = urlParts[4],
        fragment = urlParts[5];

    if (!(
      isValidMatch(scheme, twttr.txt.regexen.validateUrlScheme) && scheme.match(/^https?$/i) &&
      isValidMatch(path, twttr.txt.regexen.validateUrlPath) &&
      isValidMatch(query, twttr.txt.regexen.validateUrlQuery, true) &&
      isValidMatch(fragment, twttr.txt.regexen.validateUrlFragment, true)
    )) {
      return false;
    }

    return (unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlUnicodeAuthority)) ||
           (!unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlAuthority));
  };

  function isValidMatch(string, regex, optional) {
    if (!optional) {
      // RegExp["$&"] is the text of the last match
      // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
      return ((typeof string === "string") && string.match(regex) && RegExp["$&"] === string);
    }

    // RegExp["$&"] is the text of the last match
    return (!string || (string.match(regex) && RegExp["$&"] === string));
  }


}());