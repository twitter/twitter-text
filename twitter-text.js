if (!window.twttr) {
  window.twttr = {};
}

if (!window.twttr.util) {
  window.twttr.util = {};
}

(function() {
  twttr.util.twitterText = {};
  var REGEXEN = {};

  // Builds a RegExp
  function R(r, f) {
    f = f || "";
    if (typeof r !== "string") {
      if (r.global && f.indexOf("g") < 0) {
        f += "g";
      }
      if (r.ignoreCase && f.indexOf("i") < 0) {
        f += "i";
      }
      if (r.multiline && f.indexOf("m") < 0) {
        f += "m";
      }

      r = r.source;
    }

    return new RegExp(r.replace(/#\{(\w+)\}/g, function(m, name) {
      return REGEXEN[name] ? REGEXEN[name].source : "";
    }), f);
  }

  // Join Regexes
  function J(a, f) {
    var r = "";
    for (var i = 0; i < a.length; i++) {
      var s = a[i];
      if (typeof s !== "string") {
        s = s.source;
      }
      r += s;
    }
    return new RegExp(r, f);
  }

  // Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
  // to access both the list of characters and a pattern suitible for use with String#split
  // Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
  var UNICODE_SPACES = [
  //   (0x0009..0x000D).to_a,  # White_Space # Cc   [5] <control-0009>..<control-000D>
  //   0x0020,          # White_Space # Zs       SPACE
  //   0x0085,          # White_Space # Cc       <control-0085>
  //   0x00A0,          # White_Space # Zs       NO-BREAK SPACE
  //   0x1680,          # White_Space # Zs       OGHAM SPACE MARK
  //   0x180E,          # White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
  //   (0x2000..0x200A).to_a, # White_Space # Zs  [11] EN QUAD..HAIR SPACE
  //   0x2028,          # White_Space # Zl       LINE SEPARATOR
  //   0x2029,          # White_Space # Zp       PARAGRAPH SEPARATOR
  //   0x202F,          # White_Space # Zs       NARROW NO-BREAK SPACE
  //   0x205F,          # White_Space # Zs       MEDIUM MATHEMATICAL SPACE
  //   0x3000,          # White_Space # Zs       IDEOGRAPHIC SPACE
  ];

  REGEXEN.spaces = / /; //new RegExp(UNICODE_SPACES.collect{ |e| [e].pack 'U*' }.join('|'))
  REGEXEN.punct = /.,/; // TODO
  REGEXEN.atSigns = /[@＠]/;
  REGEXEN.extractMentions = R(/(^|[^a-zA-Z0-9_])#{atSigns}([a-zA-Z0-9_]{1,20})(?=(.|$))/g);
  REGEXEN.extractReply = R(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
  REGEXEN.listName = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/;

  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
  var LATIN_ACCENTS = [
    // (0xc0..0xd6).to_a, (0xd8..0xf6).to_a, (0xf8..0xff).to_a
  ];//.flatten.pack('U*').freeze
  REGEXEN.latinAccentChars = /a-z/; // todo
  REGEXEN.latenAccents = R(/[#{latinAccentChars}]+/);

  REGEXEN.endScreenNameMatch = R(/#{atSigns}|#{latinAccents}/);

  // Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
  REGEXEN.hashtagCharacters = R(/[a-z0-9_#{latinAccentChars}]/i);
  REGEXEN.autoLinkHashtags = R(/(^|[^0-9A-Z&\/]+)(#|＃)([0-9A-Z_]*[A-Z_]+#{hashtagCharacters}*)/i);
  REGEXEN.autoLinkUsernamesOrLists = /([^a-zA-Z0-9_]|^|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?($|.)/;
  REGEXEN.autoLinkEmoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/;

  // URL related hash regex collection
  REGEXEN.validPrecedingChars = /(?:[^\/"':!=]|^|\:)/;
  REGEXEN.validDomain = R(/(?:[^#{punct}\s][\.-](?=[^#{punct}\s])|[^#{punct}\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i);

  REGEXEN.validGeneralUrlPathChars = /[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~]/i;
  // Allow URL paths to contain balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  REGEXEN.wikipediaDisambiguation = R(/(?:\(#{validGeneralUrlPathChars]}+\))/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
  REGEXEN.validUrlPathChars = R(/(?:#{wikipediaDisambiguation}|@#{validGeneralUrlPathChars]}+\/|[\.\,]?#{validGeneralUrlPathChars]})/i);

  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  REGEXEN.validUrlPathEndingChars = /[a-z0-9=#\/]/i;
  REGEXEN.validUrlQueryChars = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/i;
  REGEXEN.validUrlQueryEndingChars = /[a-z0-9_&=#]/i;
  REGEXEN.validUrl = J([
    '(',                                                                                   //   $1 total match
      R(/(#{validPrecedingChars})/),                                                //  $2 Preceeding chracter
      '(',                                                                                   //   $3 URL
        /(https?:\/\/|www\.)/,                                                               //  $4 Protocol or beginning
        R(/(#{validDomain})/),                                                       //   $5 Domain(s) and optional post number
        R(/\/#{validUrlPathChars]}*/),
        R(/#{validUrlPathEndingChars}?/),
      ')?',                                                                              //   $6 URL Path
      R(/(\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?/), //   $7 Query String
    ')'
  ], "i");

  console.log(REGEXEN);

}());