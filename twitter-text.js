if (!window.twttr) {
  window.twttr = {};
}

(function() {
  twttr.txt = {};

  var REGEXEN = twttr.txt.regexen = {};

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
      var regex = REGEXEN[name] || "";
      if (typeof regex !== "string") {
        regex = regex.source;
      }
      return regex;
    }), f);
  }

  // simple string interpolation
  function S(s, d) {
    return s.replace(/#\{(\w+)\}/g, function(m, name) {
      return d[name] || "";
    });
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
  REGEXEN.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~/;
  REGEXEN.atSigns = /[@＠]/;
  REGEXEN.extractMentions = R(/(^|[^a-zA-Z0-9_])#{atSigns}([a-zA-Z0-9_]{1,20})(?=(.|$))/g);
  REGEXEN.extractReply = R(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
  REGEXEN.listName = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/;

  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
  var LATIN_ACCENTS = [
    // (0xc0..0xd6).to_a, (0xd8..0xf6).to_a, (0xf8..0xff).to_a
  ];//.flatten.pack('U*').freeze
  REGEXEN.latinAccentChars = R("ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ\\303\\277");
  REGEXEN.latenAccents = R(/[#{latinAccentChars}]+/);

  REGEXEN.endScreenNameMatch = R(/#{atSigns}|[#{latinAccentChars}]/);

  // Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
  REGEXEN.hashtagCharacters = R(/[a-z0-9_#{latinAccentChars}]/i);
  REGEXEN.autoLinkHashtags = R(/(^|[^0-9A-Z&\/]+)(#|＃)([0-9A-Z_]*[A-Z_]+#{hashtagCharacters}*)/gi);
  REGEXEN.autoLinkUsernamesOrLists = /(^|[^a-zA-Z0-9_]|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?(.|$)/g;
  REGEXEN.autoLinkEmoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/g;

  // URL related hash regex collection
  REGEXEN.validPrecedingChars = /(?:[^\/"':!=]|^|\:)/;
  REGEXEN.validDomain = R(/(?:[^#{punct}\s][\.-](?=[^#{punct}\s])|[^#{punct}\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i);

  REGEXEN.validGeneralUrlPathChars = /[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~]/i;
  // Allow URL paths to contain balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  REGEXEN.wikipediaDisambiguation = R(/(?:\(#{validGeneralUrlPathChars}+\))/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
  REGEXEN.validUrlPathChars = R(/(?:#{wikipediaDisambiguation}|@#{validGeneralUrlPathChars}+\/|[\.\,]?#{validGeneralUrlPathChars})/i);

  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  REGEXEN.validUrlPathEndingChars = /[a-z0-9=#\/]/i;
  REGEXEN.validUrlQueryChars = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/i;
  REGEXEN.validUrlQueryEndingChars = /[a-z0-9_&=#]/i;
  REGEXEN.validUrl = R(
    '('                                                            + // $1 total match
      '(#{validPrecedingChars})'                                   + // $2 Preceeding chracter
      '('                                                          + // $3 URL
        '(https?:\\/\\/|www\\.)'                                   + // $4 Protocol or beginning
        '(#{validDomain})'                                         + // $5 Domain(s) and optional post number
        '('                                                        + // $6 URL Path
          '\\/#{validUrlPathChars}*'                              +
          '#{validUrlPathEndingChars}?'                            +
        ')?'                                                       +
        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $7 Query String
      ')'                                                          +
    ')'
  , "gi");

  var WWW_REGEX = /www\./i;


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

  twttr.txt.autoLink = function(text, options) {
    options = options || {};
    return twttr.txt.autoLinkUsernamesOrLists(
      twttr.txt.autoLinkUrlsCustom(
        twttr.txt.autoLinkHashtags(text, options),
      options),
    options);
  };


  twttr.txt.autoLinkUsernamesOrLists = function(text, options, callback) {
    options = options || {};

    // options = options.dup
    options.urlClass = options.urlClass || DEFAULT_URL_CLASS;
    options.listClass = options.listClass || DEFAULT_LIST_CLASS;
    options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
    options.usernameUrlBase = options.usernameUrlBase || "http://twitter.com/";
    options.listUrlBase = options.listUrlBase || "http://twitter.com/";
    if (!options.suppressNoFollow) {
      var extraHtml = HTML_ATTR_NO_FOLLOW;
    }

    var newText = "",
        splitText = text.split(/[<>]/);

    for (var index = 0; index < splitText.length; index++) {
      var chunk = splitText[index];

      if (index !== 0) {
        newText += ((index % 2 === 0) ? ">" : "<");
      }

      if (index % 4 !== 0) {
        newText += chunk;
      } else {
        newText += chunk.replace(REGEXEN.autoLinkUsernamesOrLists, function(match, before, at, user, slashListname, after) {
          var d = {
            before: before,
            at: at,
            user: user,
            slashListname: slashListname,
            after: after,
            extraHtml: extraHtml,
            chunk: chunk
          };
          for (var k in options) {
            if (options.hasOwnProperty(k)) {
              d[k] = options[k];
            }
          }

          if (slashListname && !options.suppressLists) {
            // the link is a list
            var list = d.chunk = S("#{user}#{slashListname}", d);
            if (callback) {
              list = callback(list);
            }
            d.list = list.toLowerCase();
            return S("#{before}#{at}<a class=\"#{urlClass} #{listClass}\" href=\"#{listUrlBase}#{list}\"#{extraHtml}>#{chunk}</a>#{after}", d);
          } else {
            console.log(after);
            if (after && after.match(REGEXEN.endScreenNameMatch)) {
              console.log("matched after");
              // Followed by something that means we don't autolink
              return match;
            } else {
              // this is a screen name
              d.chunk = user;
              if (callback) {
                d.chunk = callback(d.chunk);
              }
              return S("#{before}#{at}<a class=\"#{urlClass} #{usernameClass}\" href=\"#{usernameUrlBase}#{chunk}\"#{extraHtml}>#{chunk}</a>#{after}", d);
            }
          }
        });
      }
    }

    return newText;
  };

  twttr.txt.autoLinkHashtags = function(text, options, callback) {
    //    options = options.dup
    options.urlClass = options.urlClass || DEFAULT_URL_CLASS;
    options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
    options.hashtagUrlBase = options.hashtagUrlBase || "http://twitter.com/search?q=%23";
    if (!options.suppressNoFollow) {
      var extraHtml = HTML_ATTR_NO_FOLLOW;
    }

    return text.replace(REGEXEN.autoLinkHashtags, function(match, before, hash, text) {
      if (callback) {
        text = callback(text);
      }
      var d = {
        before: before,
        hash: hash,
        text: text,
        extraHtml: extraHtml
      };

      for (var k in options) {
        if (options.hasOwnProperty(k)) {
          d[k] = options[k];
        }
      }

      return S("#{before}<a href=\"#{hashtagUrlBase}#{text}\" title=\"##{text}\" class=\"#{urlClass} #{hashtagClass}\"#{extraHtml}>#{hash}#{text}</a>", d);
    });
  };


  twttr.txt.autoLinkUrlsCustom = function(text, options) {
    // options = href_options.dup
    if (!options.suppressNoFollow) {
      options.rel = "nofollow";
      delete options.suppressNoFollow;
    }

    return text.replace(REGEXEN.validUrl, function(match, all, before, url, protocol) {
      var htmlAttrs = "";//tag_options(options.stringify_keys) || ""
      var fullUrl = ((protocol && protocol.match(WWW_REGEX)) ? S("http://#{url}", {url: url}) : url);

      var d = {
        before: before,
        fullUrl: fullUrl,
        htmlAttrs: htmlAttrs,
        url: url
      };

      return S("#{before}<a href=\"#{fullUrl}\"#{htmlAttrs}>#{url}</a>", d);
    });
  };

  twttr.txt.extractMentionedScreenNames = function(text, callback) {
    var screenNamesOnly = [],
        screenNamesWithIndices = twttr.txt.extractMentionedScreenNamesWithIndices(text);

    for (var i = 0; i < screenNamesWithIndices.length; i++) {
      var screenName = screenNamesWithIndices[i].screenName;
      if (callback) {
        screenName = callback(screenName);
      }
      screenNamesOnly.push(screenName);
    }

    screen_names_only.each{|mention| yield mention } if block_given?
    screen_names_only
  end

  # Extracts a list of all usersnames mentioned in the Tweet <tt>text</tt>
  # along with the indices for where the mention ocurred.  If the
  # <tt>text</tt> is nil or contains no username mentions, an empty array
  # will be returned.
  #
  # If a block is given, then it will be called with each username, the start
  # index, and the end index in the <tt>text</tt>.
  def extract_mentioned_screen_names_with_indices(text) # :yields: username, start, end
    return [] unless text

    possible_screen_names = []
    position = 0
    text.to_s.scan(Twitter::Regex[:extract_mentions]) do |before, sn, after|
      unless after =~ Twitter::Regex[:end_screen_name_match]
        start_position = text.to_s.sub_string_search(sn, position) - 1
        position = start_position + sn.char_length + 1
        possible_screen_names << {
          :screen_name => sn,
          :indices => [start_position, position]
        }
      end
    end
    if block_given?
      possible_screen_names.each do |mention|
        yield mention[:screen_name], mention[:indices].first, mention[:indices].last
      end
    end
    possible_screen_names
  end

  # Extracts the username username replied to in the Tweet <tt>text</tt>. If the
  # <tt>text</tt> is <tt>nil</tt> or is not a reply nil will be returned.
  #
  # If a block is given then it will be called with the username replied to (if any)
  def extract_reply_screen_name(text) # :yields: username
    return nil unless text

    possible_screen_name = text.match(Twitter::Regex[:extract_reply])
    return unless possible_screen_name.respond_to?(:captures)
    screen_name = possible_screen_name.captures.first
    yield screen_name if block_given?
    screen_name
  end

  # Extracts a list of all URLs included in the Tweet <tt>text</tt>. If the
  # <tt>text</tt> is <tt>nil</tt> or contains no URLs an empty array
  # will be returned.
  #
  # If a block is given then it will be called for each URL.
  def extract_urls(text) # :yields: url
    urls_only = extract_urls_with_indices(text).map{|url| url[:url] }
    urls_only.each{|url| yield url } if block_given?
    urls_only
  end

  # Extracts a list of all URLs included in the Tweet <tt>text</tt> along
  # with the indices. If the <tt>text</tt> is <tt>nil</tt> or contains no
  # URLs an empty array will be returned.
  #
  # If a block is given then it will be called for each URL.
  def extract_urls_with_indices(text) # :yields: url, start, end
    return [] unless text
    urls = []
    position = 0
    text.to_s.scan(Twitter::Regex[:valid_url]) do |all, before, url, protocol, domain, path, query|
      start_position = text.to_s.sub_string_search(url, position)
      end_position = start_position + url.char_length
      position = end_position
      urls << {
        :url => (protocol == "www." ? "http://#{url}" : url),
        :indices => [start_position, end_position]
      }
    end
    urls.each{|url| yield url[:url], url[:indices].first, url[:indices].last } if block_given?
    urls
  end

  # Extracts a list of all hashtags included in the Tweet <tt>text</tt>. If the
  # <tt>text</tt> is <tt>nil</tt> or contains no hashtags an empty array
  # will be returned. The array returned will not include the leading <tt>#</tt>
  # character.
  #
  # If a block is given then it will be called for each hashtag.
  def extract_hashtags(text) # :yields: hashtag_text
    hashtags_only = extract_hashtags_with_indices(text).map{|hash| hash[:hashtag] }
    hashtags_only.each{|hash| yield hash } if block_given?
    hashtags_only
  end

  # Extracts a list of all hashtags included in the Tweet <tt>text</tt>. If the
  # <tt>text</tt> is <tt>nil</tt> or contains no hashtags an empty array
  # will be returned. The array returned will not include the leading <tt>#</tt>
  # character.
  #
  # If a block is given then it will be called for each hashtag.
  def extract_hashtags_with_indices(text) # :yields: hashtag_text, start, end
    return [] unless text

    tags = []
    position = 0
    text.scan(Twitter::Regex[:auto_link_hashtags]) do |before, hash, hash_text|
      start_position = text.to_s.sub_string_search(hash, position)
      position = start_position + hash_text.char_length + 1
      tags << {
        :hashtag => hash_text,
        :indices => [start_position, position]
      }
    end
    tags.each{|tag| yield tag[:hashtag], tag[:indices].first, tag[:indices].last } if block_given?
    tags
  end


}());