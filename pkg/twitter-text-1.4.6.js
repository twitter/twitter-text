/*!
 * twitter-text-js 1.4.6
 *
 * Copyright 2011 Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License below, or at:
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 *                              Apache License
 *                        Version 2.0, January 2004
 *                     http://www.apache.org/licenses/
 * 
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
 * 
 * 1. Definitions.
 * 
 *   "License" shall mean the terms and conditions for use, reproduction,
 *   and distribution as defined by Sections 1 through 9 of this document.
 * 
 *   "Licensor" shall mean the copyright owner or entity authorized by
 *   the copyright owner that is granting the License.
 * 
 *   "Legal Entity" shall mean the union of the acting entity and all
 *   other entities that control, are controlled by, or are under common
 *   control with that entity. For the purposes of this definition,
 *   "control" means (i) the power, direct or indirect, to cause the
 *   direction or management of such entity, whether by contract or
 *   otherwise, or (ii) ownership of fifty percent (50%) or more of the
 *   outstanding shares, or (iii) beneficial ownership of such entity.
 * 
 *   "You" (or "Your") shall mean an individual or Legal Entity
 *   exercising permissions granted by this License.
 * 
 *   "Source" form shall mean the preferred form for making modifications,
 *   including but not limited to software source code, documentation
 *   source, and configuration files.
 * 
 *   "Object" form shall mean any form resulting from mechanical
 *   transformation or translation of a Source form, including but
 *   not limited to compiled object code, generated documentation,
 *   and conversions to other media types.
 * 
 *   "Work" shall mean the work of authorship, whether in Source or
 *   Object form, made available under the License, as indicated by a
 *   copyright notice that is included in or attached to the work
 *   (an example is provided in the Appendix below).
 * 
 *   "Derivative Works" shall mean any work, whether in Source or Object
 *   form, that is based on (or derived from) the Work and for which the
 *   editorial revisions, annotations, elaborations, or other modifications
 *   represent, as a whole, an original work of authorship. For the purposes
 *   of this License, Derivative Works shall not include works that remain
 *   separable from, or merely link (or bind by name) to the interfaces of,
 *   the Work and Derivative Works thereof.
 * 
 *   "Contribution" shall mean any work of authorship, including
 *   the original version of the Work and any modifications or additions
 *   to that Work or Derivative Works thereof, that is intentionally
 *   submitted to Licensor for inclusion in the Work by the copyright owner
 *   or by an individual or Legal Entity authorized to submit on behalf of
 *   the copyright owner. For the purposes of this definition, "submitted"
 *   means any form of electronic, verbal, or written communication sent
 *   to the Licensor or its representatives, including but not limited to
 *   communication on electronic mailing lists, source code control systems,
 *   and issue tracking systems that are managed by, or on behalf of, the
 *   Licensor for the purpose of discussing and improving the Work, but
 *   excluding communication that is conspicuously marked or otherwise
 *   designated in writing by the copyright owner as "Not a Contribution."
 * 
 *   "Contributor" shall mean Licensor and any individual or Legal Entity
 *   on behalf of whom a Contribution has been received by Licensor and
 *   subsequently incorporated within the Work.
 * 
 * 2. Grant of Copyright License. Subject to the terms and conditions of
 *   this License, each Contributor hereby grants to You a perpetual,
 *   worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 *   copyright license to reproduce, prepare Derivative Works of,
 *   publicly display, publicly perform, sublicense, and distribute the
 *   Work and such Derivative Works in Source or Object form.
 * 
 * 3. Grant of Patent License. Subject to the terms and conditions of
 *   this License, each Contributor hereby grants to You a perpetual,
 *   worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 *   (except as stated in this section) patent license to make, have made,
 *   use, offer to sell, sell, import, and otherwise transfer the Work,
 *   where such license applies only to those patent claims licensable
 *   by such Contributor that are necessarily infringed by their
 *   Contribution(s) alone or by combination of their Contribution(s)
 *   with the Work to which such Contribution(s) was submitted. If You
 *   institute patent litigation against any entity (including a
 *   cross-claim or counterclaim in a lawsuit) alleging that the Work
 *   or a Contribution incorporated within the Work constitutes direct
 *   or contributory patent infringement, then any patent licenses
 *   granted to You under this License for that Work shall terminate
 *   as of the date such litigation is filed.
 * 
 * 4. Redistribution. You may reproduce and distribute copies of the
 *   Work or Derivative Works thereof in any medium, with or without
 *   modifications, and in Source or Object form, provided that You
 *   meet the following conditions:
 * 
 *   (a) You must give any other recipients of the Work or
 *       Derivative Works a copy of this License; and
 * 
 *   (b) You must cause any modified files to carry prominent notices
 *       stating that You changed the files; and
 * 
 *   (c) You must retain, in the Source form of any Derivative Works
 *       that You distribute, all copyright, patent, trademark, and
 *       attribution notices from the Source form of the Work,
 *       excluding those notices that do not pertain to any part of
 *       the Derivative Works; and
 * 
 *   (d) If the Work includes a "NOTICE" text file as part of its
 *       distribution, then any Derivative Works that You distribute must
 *       include a readable copy of the attribution notices contained
 *       within such NOTICE file, excluding those notices that do not
 *       pertain to any part of the Derivative Works, in at least one
 *       of the following places: within a NOTICE text file distributed
 *       as part of the Derivative Works; within the Source form or
 *       documentation, if provided along with the Derivative Works; or,
 *       within a display generated by the Derivative Works, if and
 *       wherever such third-party notices normally appear. The contents
 *       of the NOTICE file are for informational purposes only and
 *       do not modify the License. You may add Your own attribution
 *       notices within Derivative Works that You distribute, alongside
 *       or as an addendum to the NOTICE text from the Work, provided
 *       that such additional attribution notices cannot be construed
 *       as modifying the License.
 * 
 *   You may add Your own copyright statement to Your modifications and
 *   may provide additional or different license terms and conditions
 *   for use, reproduction, or distribution of Your modifications, or
 *   for any such Derivative Works as a whole, provided Your use,
 *   reproduction, and distribution of the Work otherwise complies with
 *   the conditions stated in this License.
 * 
 * 5. Submission of Contributions. Unless You explicitly state otherwise,
 *   any Contribution intentionally submitted for inclusion in the Work
 *   by You to the Licensor shall be under the terms and conditions of
 *   this License, without any additional terms or conditions.
 *   Notwithstanding the above, nothing herein shall supersede or modify
 *   the terms of any separate license agreement you may have executed
 *   with Licensor regarding such Contributions.
 * 
 * 6. Trademarks. This License does not grant permission to use the trade
 *   names, trademarks, service marks, or product names of the Licensor,
 *   except as required for reasonable and customary use in describing the
 *   origin of the Work and reproducing the content of the NOTICE file.
 * 
 * 7. Disclaimer of Warranty. Unless required by applicable law or
 *   agreed to in writing, Licensor provides the Work (and each
 *   Contributor provides its Contributions) on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 *   implied, including, without limitation, any warranties or conditions
 *   of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
 *   PARTICULAR PURPOSE. You are solely responsible for determining the
 *   appropriateness of using or redistributing the Work and assume any
 *   risks associated with Your exercise of permissions under this License.
 * 
 * 8. Limitation of Liability. In no event and under no legal theory,
 *   whether in tort (including negligence), contract, or otherwise,
 *   unless required by applicable law (such as deliberate and grossly
 *   negligent acts) or agreed to in writing, shall any Contributor be
 *   liable to You for damages, including any direct, indirect, special,
 *   incidental, or consequential damages of any character arising as a
 *   result of this License or out of the use or inability to use the
 *   Work (including but not limited to damages for loss of goodwill,
 *   work stoppage, computer failure or malfunction, or any and all
 *   other commercial damages or losses), even if such Contributor
 *   has been advised of the possibility of such damages.
 * 
 * 9. Accepting Warranty or Additional Liability. While redistributing
 *   the Work or Derivative Works thereof, You may choose to offer,
 *   and charge a fee for, acceptance of support, warranty, indemnity,
 *   or other liability obligations and/or rights consistent with this
 *   License. However, in accepting such obligations, You may act only
 *   on Your own behalf and on Your sole responsibility, not on behalf
 *   of any other Contributor, and only if You agree to indemnify,
 *   defend, and hold each Contributor harmless for any liability
 *   incurred by, or claims asserted against, such Contributor by reason
 *   of your accepting any such warranty or additional liability.
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
    "'": '&#39;'
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

  function addCharsToCharClass(charClass, start, end) {
    var s = String.fromCharCode(start);
    if (end !== start) {
      s += "-" + String.fromCharCode(end);
    }
    charClass.push(s);
    return charClass;
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
  addCharsToCharClass(UNICODE_SPACES, 0x009, 0x00D); // White_Space # Cc   [5] <control-0009>..<control-000D>
  addCharsToCharClass(UNICODE_SPACES, 0x2000, 0x200A); // White_Space # Zs  [11] EN QUAD..HAIR SPACE

  twttr.txt.regexen.spaces_group = regexSupplant(UNICODE_SPACES.join(""));
  twttr.txt.regexen.spaces = regexSupplant("[" + UNICODE_SPACES.join("") + "]");
  twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~/;
  twttr.txt.regexen.atSigns = /[@＠]/;
  twttr.txt.regexen.extractMentions = regexSupplant(/(^|[^a-zA-Z0-9_])(#{atSigns})([a-zA-Z0-9_]{1,20})(?=(.|$))/g);
  twttr.txt.regexen.extractReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
  twttr.txt.regexen.listName = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/;
  twttr.txt.regexen.extractMentionsOrLists = regexSupplant(/(^|[^a-zA-Z0-9_])(#{atSigns})([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?(?=(.|$))/g);

  var nonLatinHashtagChars = [];
  // Cyrillic
  addCharsToCharClass(nonLatinHashtagChars, 0x0400, 0x04ff); // Cyrillic
  addCharsToCharClass(nonLatinHashtagChars, 0x0500, 0x0527); // Cyrillic Supplement
  addCharsToCharClass(nonLatinHashtagChars, 0x2de0, 0x2dff); // Cyrillic Extended A
  addCharsToCharClass(nonLatinHashtagChars, 0xa640, 0xa69f); // Cyrillic Extended B
  // Hangul (Korean)
  addCharsToCharClass(nonLatinHashtagChars, 0x1100, 0x11ff); // Hangul Jamo
  addCharsToCharClass(nonLatinHashtagChars, 0x3130, 0x3185); // Hangul Compatibility Jamo
  addCharsToCharClass(nonLatinHashtagChars, 0xA960, 0xA97F); // Hangul Jamo Extended-A
  addCharsToCharClass(nonLatinHashtagChars, 0xAC00, 0xD7AF); // Hangul Syllables
  addCharsToCharClass(nonLatinHashtagChars, 0xD7B0, 0xD7FF); // Hangul Jamo Extended-B
  addCharsToCharClass(nonLatinHashtagChars, 0xFFA1, 0xFFDC); // half-width Hangul
  // Japanese and Chinese
  addCharsToCharClass(nonLatinHashtagChars, 0x30A1, 0x30FA); // Katakana (full-width)
  addCharsToCharClass(nonLatinHashtagChars, 0x30FC, 0x30FE); // Katakana Chouon and iteration marks (full-width)
  addCharsToCharClass(nonLatinHashtagChars, 0xFF66, 0xFF9F); // Katakana (half-width)
  addCharsToCharClass(nonLatinHashtagChars, 0xFF70, 0xFF70); // Katakana Chouon (half-width)
  addCharsToCharClass(nonLatinHashtagChars, 0xFF10, 0xFF19); // \
  addCharsToCharClass(nonLatinHashtagChars, 0xFF21, 0xFF3A); //  - Latin (full-width)
  addCharsToCharClass(nonLatinHashtagChars, 0xFF41, 0xFF5A); // /
  addCharsToCharClass(nonLatinHashtagChars, 0x3041, 0x3096); // Hiragana
  addCharsToCharClass(nonLatinHashtagChars, 0x3099, 0x309E); // Hiragana voicing and iteration mark
  addCharsToCharClass(nonLatinHashtagChars, 0x3400, 0x4DBF); // Kanji (CJK Extension A)
  addCharsToCharClass(nonLatinHashtagChars, 0x4E00, 0x9FFF); // Kanji (Unified)
  // -- Disabled as it breaks the Regex.
  //addCharsToCharClass(nonLatinHashtagChars, 0x20000, 0x2A6DF); // Kanji (CJK Extension B)
  addCharsToCharClass(nonLatinHashtagChars, 0x2A700, 0x2B73F); // Kanji (CJK Extension C)
  addCharsToCharClass(nonLatinHashtagChars, 0x2B740, 0x2B81F); // Kanji (CJK Extension D)
  addCharsToCharClass(nonLatinHashtagChars, 0x2F800, 0x2FA1F); // Kanji (CJK supplement)
  addCharsToCharClass(nonLatinHashtagChars, 0x3005, 0x3005); // Kanji iteration mark
  addCharsToCharClass(nonLatinHashtagChars, 0x303B, 0x303B); // Han iteration mark

  twttr.txt.regexen.nonLatinHashtagChars = regexSupplant(nonLatinHashtagChars.join(""));
  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
  twttr.txt.regexen.latinAccentChars = regexSupplant("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþş\\303\\277");

  twttr.txt.regexen.endScreenNameMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);

  // A hashtag must contain characters, numbers and underscores, but not all numbers.
  twttr.txt.regexen.hashtagBoundary = regexSupplant(/(?:^|$|#{spaces}|「|」|。|、|\.|!|！|\?|？|,)/);
  twttr.txt.regexen.hashtagAlpha = regexSupplant(/[a-z_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
  twttr.txt.regexen.hashtagAlphaNumeric = regexSupplant(/[a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
  twttr.txt.regexen.autoLinkHashtags = regexSupplant(/(#{hashtagBoundary})(#|＃)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);
  twttr.txt.regexen.autoLinkUsernamesOrLists = /(^|[^a-zA-Z0-9_]|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?/g;
  twttr.txt.regexen.autoLinkEmoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/g;

  // URL related hash regex collection
  twttr.txt.regexen.invalidDomainChars = stringSupplant("\u00A0#{punct}#{spaces_group}", twttr.txt.regexen);
  twttr.txt.regexen.validPrecedingChars = regexSupplant(/(?:[^-\/"':!=A-Za-z0-9_@＠]|^|\:)/);

  twttr.txt.regexen.validSubdomain = regexSupplant(/(?:[^#{invalidDomainChars}](?:[_-]|[^#{invalidDomainChars}])*)?[^#{invalidDomainChars}]\./);
  twttr.txt.regexen.validDomainName = regexSupplant(/(?:[^#{invalidDomainChars}](?:[-]|[^#{invalidDomainChars}])*)?[^#{invalidDomainChars}]/);
  twttr.txt.regexen.validDomain = regexSupplant(/(#{validSubdomain})*#{validDomainName}\.(?:xn--[a-z0-9]{2,}|[a-z]{2,})(?::[0-9]+)?/i);

  twttr.txt.regexen.validGeneralUrlPathChars = regexSupplant(/[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~|#{latinAccentChars}]/i);
  // Allow URL paths to contain balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  twttr.txt.regexen.wikipediaDisambiguation = regexSupplant(/(?:\(#{validGeneralUrlPathChars}+\))/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
  twttr.txt.regexen.validUrlPathChars = regexSupplant(/(?:#{wikipediaDisambiguation}|@#{validGeneralUrlPathChars}+\/|[\.,]?#{validGeneralUrlPathChars}?)/i);

  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/(?:[\+\-a-z0-9=_#\/#{latinAccentChars}]|#{wikipediaDisambiguation})/i);
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
    delete options.listClass;
    delete options.usernameClass;
    delete options.usernameUrlBase;
    delete options.listUrlBase;

    return text.replace(twttr.txt.regexen.extractUrl, function(match, all, before, url, protocol, domain, path, queryString) {
      var tldComponents;

      if (protocol) {
        var htmlAttrs = "";
        for (var k in options) {
          htmlAttrs += stringSupplant(" #{k}=\"#{v}\" ", {k: k, v: options[k].toString().replace(/"/, "&quot;").replace(/</, "&lt;").replace(/>/, "&gt;")});
        }

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

  /**
   * Extract list or user mentions.
   * (Presence of listSlug indicates a list)
   */
  twttr.txt.extractMentionsOrListsWithIndices = function(text) {
    if (!text) {
      return [];
    }

    var possibleNames = [],
        position = 0;

    text.replace(twttr.txt.regexen.extractMentionsOrLists, function(match, before, atSign, screenName, slashListname, after) {
      if (!after.match(twttr.txt.regexen.endScreenNameMatch)) {
        slashListname = slashListname || '';
        var startPosition = text.indexOf(atSign + screenName + slashListname, position);
        position = startPosition + screenName.length + slashListname.length + 1;
        possibleNames.push({
          screenName: screenName,
          listSlug: slashListname,
          indices: [startPosition, position]
        });
      }
    });

    return possibleNames;
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

    return false;
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
