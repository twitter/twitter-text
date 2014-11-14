/*!
 * twitter-text-js 1.0.5
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
  twttr.txt.regexen.extractMentions = regexSupplant(/(^|[^a-zA-Z0-9_])#{atSigns}([a-zA-Z0-9_]{1,20})(?=(.|$))/g);
  twttr.txt.regexen.extractReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
  twttr.txt.regexen.listName = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/;

  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
  twttr.txt.regexen.latinAccentChars = regexSupplant("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ\\303\\277");
  twttr.txt.regexen.latenAccents = regexSupplant(/[#{latinAccentChars}]+/);

  twttr.txt.regexen.endScreenNameMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);

  // Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
  twttr.txt.regexen.hashtagCharacters = regexSupplant(/[a-z0-9_#{latinAccentChars}]/i);
  twttr.txt.regexen.autoLinkHashtags = regexSupplant(/(^|[^0-9A-Z&\/\?]+)(#|＃)([0-9A-Z_]*[A-Z_]+#{hashtagCharacters}*)/gi);
  twttr.txt.regexen.autoLinkUsernamesOrLists = /(^|[^a-zA-Z0-9_]|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?/g;
  twttr.txt.regexen.autoLinkEmoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/g;

  // URL related hash regex collection
  twttr.txt.regexen.validPrecedingChars = regexSupplant(/(?:[^-\/"':!=A-Za-z0-9_@＠]|^|\:)/);
  twttr.txt.regexen.validDomain = regexSupplant(/(?:[^#{punct}\s][\.-](?=[^#{punct}\s])|[^#{punct}\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i);

  // For protocol-less URLs, we'll accept them if they end in one of a handful of likely TLDs
  twttr.txt.regexen.probableTld = /^(.*?)((?:[a-z0-9_\.\-]+)\.(?:com|net|org|gov|edu))$/i;

  twttr.txt.regexen.www = /www\./i;

  twttr.txt.regexen.validGeneralUrlPathChars = /[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~]/i;
  // Allow URL paths to contain balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  twttr.txt.regexen.wikipediaDisambiguation = regexSupplant(/(?:\(#{validGeneralUrlPathChars}+\))/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
  twttr.txt.regexen.validUrlPathChars = regexSupplant(/(?:#{wikipediaDisambiguation}|@#{validGeneralUrlPathChars}+\/|[\.\,]?#{validGeneralUrlPathChars})/i);

  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  twttr.txt.regexen.validUrlPathEndingChars = /[a-z0-9=#\/]/i;
  twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/i;
  twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
  twttr.txt.regexen.validUrl = regexSupplant(
    '('                                                            + // $1 total match
      '(#{validPrecedingChars})'                                   + // $2 Preceeding chracter
      '('                                                          + // $3 URL
        '((?:https?:\\/\\/|www\\.)?)'                              + // $4 Protocol or beginning
        '(#{validDomain})'                                         + // $5 Domain(s) and optional post number
        '('                                                        + // $6 URL Path
          '\\/#{validUrlPathChars}*'                               +
          '#{validUrlPathEndingChars}?'                            +
        ')?'                                                       +
        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $7 Query String
      ')'                                                          +
    ')'
  , "gi");

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
            chunk: twttr.txt.htmlEscape(chunk)
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
              return stringSupplant("#{before}#{at}<a class=\"#{urlClass} #{usernameClass}\" #{dataScreenName}href=\"#{usernameUrlBase}#{chunk}\"#{extraHtml}>#{chunk}</a>", d);
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
        text: twttr.txt.htmlEscape(text),
        extraHtml: extraHtml
      };

      for (var k in options) {
        if (options.hasOwnProperty(k)) {
          d[k] = options[k];
        }
      }

      return stringSupplant("#{before}<a href=\"#{hashtagUrlBase}#{text}\" title=\"##{text}\" class=\"#{urlClass} #{hashtagClass}\"#{extraHtml}>#{hash}#{text}</a>", d);
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

    return text.replace(twttr.txt.regexen.validUrl, function(match, all, before, url, protocol, domain, path, queryString) {
      var tldComponents;

      if (protocol) {
        var htmlAttrs = "";
        for (var k in options) {
          htmlAttrs += stringSupplant(" #{k}=\"#{v}\" ", {k: k, v: options[k].toString().replace(/"/, "&quot;").replace(/</, "&lt;").replace(/>/, "&gt;")});
        }
        options.htmlAttrs || "";
        var fullUrl = ((!protocol || protocol.match(twttr.txt.regexen.www)) ? stringSupplant("http://#{url}", {url: url}) : url);

        var d = {
          before: before,
          fullUrl: twttr.txt.htmlEscape(fullUrl),
          htmlAttrs: htmlAttrs,
          url: twttr.txt.htmlEscape(url)
        };

        return stringSupplant("#{before}<a href=\"#{fullUrl}\"#{htmlAttrs}>#{url}</a>", d);
      } else if (tldComponents = all.match(twttr.txt.regexen.probableTld)) {
        var tldBefore = tldComponents[1];
        var tldUrl = tldComponents[2];
        var htmlAttrs = "";
        for (var k in options) {
          htmlAttrs += stringSupplant(" #{k}=\"#{v}\" ", {
            k: k,
            v: twttr.txt.htmlEscape(options[k].toString())
          });
        }
        options.htmlAttrs || "";

        var fullUrl = stringSupplant("http://#{url}", {
          url: tldUrl
        });
        var prefix = (tldBefore == before ? before : stringSupplant("#{before}#{tldBefore}", {
          before: before,
          tldBefore: tldBefore
        }));

        var d = {
          before: prefix,
          fullUrl: twttr.txt.htmlEscape(fullUrl),
          htmlAttrs: htmlAttrs,
          url: twttr.txt.htmlEscape(tldUrl)
        };

        return stringSupplant("#{before}<a href=\"#{fullUrl}\"#{htmlAttrs}>#{url}</a>", d);
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

    text.replace(twttr.txt.regexen.extractMentions, function(match, before, screenName, after) {
      if (!after.match(twttr.txt.regexen.endScreenNameMatch)) {
        var startPosition = text.indexOf(screenName, position) - 1;
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

    text.replace(twttr.txt.regexen.validUrl, function(match, all, before, url, protocol, domain, path, query) {
      var tldComponents;

      if (protocol) {
        var startPosition = text.indexOf(url, position),
            position = startPosition + url.length;

        urls.push({
          url: ((!protocol || protocol.match(twttr.txt.regexen.www)) ? stringSupplant("http://#{url}", {
            url: url
          }) : url),
          indices: [startPosition, position]
        });
      } else if (tldComponents = all.match(twttr.txt.regexen.probableTld)) {
        var tldUrl = tldComponents[2];
        var startPosition = text.indexOf(tldUrl, position),
            position = startPosition + tldUrl.length;

        urls.push({
          url: stringSupplant("http://#{tldUrl}", {
            tldUrl: tldUrl
          }),
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


}());