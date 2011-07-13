# encoding: utf-8
module Twitter
  # A collection of regular expressions for parsing Tweet text. The regular expression
  # list is frozen at load time to ensure immutability. These reular expressions are
  # used throughout the <tt>Twitter</tt> classes. Special care has been taken to make
  # sure these reular expressions work with Tweets in all languages.
  class Regex
    REGEXEN = {} # :nodoc:

    # Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
    # to access both the list of characters and a pattern suitible for use with String#split
    #  Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
    UNICODE_SPACES = [
          (0x0009..0x000D).to_a,  # White_Space # Cc   [5] <control-0009>..<control-000D>
          0x0020,          # White_Space # Zs       SPACE
          0x0085,          # White_Space # Cc       <control-0085>
          0x00A0,          # White_Space # Zs       NO-BREAK SPACE
          0x1680,          # White_Space # Zs       OGHAM SPACE MARK
          0x180E,          # White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
          (0x2000..0x200A).to_a, # White_Space # Zs  [11] EN QUAD..HAIR SPACE
          0x2028,          # White_Space # Zl       LINE SEPARATOR
          0x2029,          # White_Space # Zp       PARAGRAPH SEPARATOR
          0x202F,          # White_Space # Zs       NARROW NO-BREAK SPACE
          0x205F,          # White_Space # Zs       MEDIUM MATHEMATICAL SPACE
          0x3000,          # White_Space # Zs       IDEOGRAPHIC SPACE
        ].flatten.freeze
    SPACE_CHAR_CLASS_VALUE = Regexp.new(UNICODE_SPACES.collect{ |e| [e].pack 'U*' }.join(''))
    REGEXEN[:spaces] = Regexp.new(UNICODE_SPACES.collect{ |e| [e].pack 'U*' }.join('|'))

    REGEXEN[:at_signs] = /[@＠]/
    REGEXEN[:extract_mentions] = /(^|[^a-zA-Z0-9_])#{REGEXEN[:at_signs]}([a-zA-Z0-9_]{1,20})(?=(.|$))/o
    REGEXEN[:extract_reply] = /^(?:#{REGEXEN[:spaces]})*#{REGEXEN[:at_signs]}([a-zA-Z0-9_]{1,20})/o

    major, minor, patch = RUBY_VERSION.split('.')
    if major.to_i >= 2 || major.to_i == 1 && minor.to_i >= 9 || (defined?(RUBY_ENGINE) && ["jruby", "rbx"].include?(RUBY_ENGINE))
      REGEXEN[:list_name] = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/
    else
      # This line barfs at compile time in Ruby 1.9, JRuby, or Rubinius.
      REGEXEN[:list_name] = eval("/[a-zA-Z][a-zA-Z0-9_\\-\x80-\xff]{0,24}/")
    end

    # Latin accented characters
    # Excludes 0xd7 from the range (the multiplication sign, confusable with "x").
    # Also excludes 0xf7, the division sign
    LATIN_ACCENTS = [(0xc0..0xd6).to_a, (0xd8..0xf6).to_a, (0xf8..0xff).to_a].flatten.pack('U*').freeze
    NON_LATIN_HASHTAG_CHARS = [
      # Cyrillic (Russian, Ukrainian, etc.)
      (0x0400..0x04ff).to_a, # Cyrillic
      (0x0500..0x0527).to_a, # Cyrillic Supplement
      # Hangul (Korean)
      (0x1100..0x11ff).to_a, # Hangul Jamo
      (0x3130..0x3185).to_a, # Hangul Compatibility Jamo
      (0xA960..0xA97F).to_a, # Hangul Jamo Extended-A
      (0xAC00..0xD7AF).to_a, # Hangul Syllables
      (0xD7B0..0xD7FF).to_a # Hangul Jamo Extended-B
    ].flatten.pack('U*').freeze
    REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o

    REGEXEN[:end_screen_name_match] = /^(?:#{REGEXEN[:at_signs]}|#{REGEXEN[:latin_accents]}|:\/\/)/o

    CJ_HASHTAG_CHARACTERS = [
      (0x30A1..0x30FA).to_a, 0x30FC, # Katakana (full-width)
      (0xFF66..0xFF9F).to_a, # Katakana (half-width)
      (0xFF10..0xFF19).to_a, (0xFF21..0xFF3A).to_a, (0xFF41..0xFF5A).to_a, # Latin (full-width)
      (0x3041..0x3096).to_a, # Hiragana
      (0x3400..0x4DBF).to_a, # Kanji (CJK Extension A)
      (0x4E00..0x9FFF).to_a, # Kanji (Unified)
      (0x20000..0x2A6DF).to_a, # Kanji (CJK Extension B)
      (0x2A700..0x2B73F).to_a, # Kanji (CJK Extension C)
      (0x2B740..0x2B81F).to_a, # Kanji (CJK Extension D)
      (0x2F800..0x2FA1F).to_a, # Kanji (CJK supplement)
      0x3005                   # Kanji (iteration mark)
    ].flatten.pack('U*').freeze

    HASHTAG_BOUNDARY = /(?:\A|\z|#{REGEXEN[:spaces]}|「|」|。|、|\.|!|\?|！|？|,)/

    # A hashtag must contain latin characters, numbers and underscores, but not all numbers.
    HASHTAG_ALPHA = /[a-z_#{LATIN_ACCENTS}#{NON_LATIN_HASHTAG_CHARS}#{CJ_HASHTAG_CHARACTERS}]/io
    HASHTAG_ALPHANUMERIC = /[a-z0-9_#{LATIN_ACCENTS}#{NON_LATIN_HASHTAG_CHARS}#{CJ_HASHTAG_CHARACTERS}]/io

    HASHTAG = /(#{HASHTAG_BOUNDARY})(#|＃)(#{HASHTAG_ALPHANUMERIC}*#{HASHTAG_ALPHA}#{HASHTAG_ALPHANUMERIC}*)(?=#{HASHTAG_BOUNDARY})/io

    REGEXEN[:auto_link_hashtags] = /#{HASHTAG}/io

    REGEXEN[:auto_link_usernames_or_lists] = /([^a-zA-Z0-9_]|^|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?/o
    REGEXEN[:auto_link_emoticon] = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/

    # URL related hash regex collection
    REGEXEN[:valid_preceding_chars] = /(?:[^-\/"':!=A-Z0-9_@＠]|^|\:)/i

    DOMAIN_EXCLUDE_PART = "[:punct:][:space:][:blank:]#{[0x00A0].pack('U')}"
    REGEXEN[:valid_subdomain] = /(?:[^#{DOMAIN_EXCLUDE_PART}](?:[_-]|[^#{DOMAIN_EXCLUDE_PART}])*)?[^#{DOMAIN_EXCLUDE_PART}]\./
    REGEXEN[:valid_domain_name] = /(?:[^#{DOMAIN_EXCLUDE_PART}](?:[-]|[^#{DOMAIN_EXCLUDE_PART}])*)?[^#{DOMAIN_EXCLUDE_PART}]/
    REGEXEN[:valid_domain] = /#{REGEXEN[:valid_subdomain]}*#{REGEXEN[:valid_domain_name]}\.(?:xn--[a-z0-9]{2,}|[a-z]{2,})(?::[0-9]+)?/i

    REGEXEN[:valid_general_url_path_chars] = /[a-z0-9!\*';:=\+\,\$\/%#\[\]\-_~|\.]/i
    # Allow URL paths to contain balanced parens
    #  1. Used in Wikipedia URLs like /Primer_(film)
    #  2. Used in IIS sessions like /S(dfd346)/
    REGEXEN[:wikipedia_disambiguation] = /(?:\(#{REGEXEN[:valid_general_url_path_chars]}+\))/i
    # Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
    REGEXEN[:valid_url_path_chars] = /(?:
      #{REGEXEN[:wikipedia_disambiguation]}|
      @#{REGEXEN[:valid_general_url_path_chars]}+\/|
      [\.,]#{REGEXEN[:valid_general_url_path_chars]}+|
      #{REGEXEN[:valid_general_url_path_chars]}+
    )/ix
    # Valid end-of-path chracters (so /foo. does not gobble the period).
    #   1. Allow =&# for empty URL parameters and other URL-join artifacts
    REGEXEN[:valid_url_path_ending_chars] = /[a-z0-9=_#\/\+\-]|#{REGEXEN[:wikipedia_disambiguation]}/io
    REGEXEN[:valid_url_query_chars] = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i
    REGEXEN[:valid_url_query_ending_chars] = /[a-z0-9_&=#\/]/i
    REGEXEN[:valid_url] = %r{
      (                                                                                     #   $1 total match
        (#{REGEXEN[:valid_preceding_chars]})                                                #   $2 Preceeding chracter
        (                                                                                   #   $3 URL
          (https?:\/\/)                                                                     #   $4 Protocol
          (#{REGEXEN[:valid_domain]})                                                       #   $5 Domain(s) and optional post number
          (/
            (?:
              #{REGEXEN[:valid_url_path_chars]}+#{REGEXEN[:valid_url_path_ending_chars]}|   # 1+ path chars and a valid last char
              #{REGEXEN[:valid_url_path_chars]}+#{REGEXEN[:valid_url_path_ending_chars]}?|  # Optional last char to handle /@foo/ case
              #{REGEXEN[:valid_url_path_ending_chars]}                                      # Just a # case
            )?
          )?                                                                                #   $6 URL Path and anchor
          (\?#{REGEXEN[:valid_url_query_chars]}*#{REGEXEN[:valid_url_query_ending_chars]})? #   $7 Query String
        )
      )
    }iox;

    # These URL validation pattern strings are based on the ABNF from RFC 3986
    REGEXEN[:validate_url_unreserved] = /[a-z0-9\-._~]/i
    REGEXEN[:validate_url_pct_encoded] = /(?:%[0-9a-f]{2})/i
    REGEXEN[:validate_url_sub_delims] = /[!$&'()*+,;=]/i
    REGEXEN[:validate_url_pchar] = /(?:
      #{REGEXEN[:validate_url_unreserved]}|
      #{REGEXEN[:validate_url_pct_encoded]}|
      #{REGEXEN[:validate_url_sub_delims]}|
      :|@
    )/iox

    REGEXEN[:validate_url_scheme] = /(?:[a-z][a-z0-9+\-.]*)/i
    REGEXEN[:validate_url_userinfo] = /(?:
      #{REGEXEN[:validate_url_unreserved]}|
      #{REGEXEN[:validate_url_pct_encoded]}|
      #{REGEXEN[:validate_url_sub_delims]}|
      :
    )*/iox

    REGEXEN[:validate_url_dec_octet] = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i
    REGEXEN[:validate_url_ipv4] =
      /(?:#{REGEXEN[:validate_url_dec_octet]}(?:\.#{REGEXEN[:validate_url_dec_octet]}){3})/iox

    # Punting on real IPv6 validation for now
    REGEXEN[:validate_url_ipv6] = /(?:\[[a-f0-9:\.]+\])/i

    # Also punting on IPvFuture for now
    REGEXEN[:validate_url_ip] = /(?:
      #{REGEXEN[:validate_url_ipv4]}|
      #{REGEXEN[:validate_url_ipv6]}
    )/iox

    # This is more strict than the rfc specifies
    REGEXEN[:validate_url_subdomain_segment] = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i
    REGEXEN[:validate_url_domain_segment] = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i
    REGEXEN[:validate_url_domain_tld] = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i
    REGEXEN[:validate_url_domain] = /(?:(?:#{REGEXEN[:validate_url_subdomain_segment]}\.)*
                                     (?:#{REGEXEN[:validate_url_domain_segment]}\.)
                                     #{REGEXEN[:validate_url_domain_tld]})/iox

    REGEXEN[:validate_url_host] = /(?:
      #{REGEXEN[:validate_url_ip]}|
      #{REGEXEN[:validate_url_domain]}
    )/iox

    # Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
    REGEXEN[:validate_url_unicode_subdomain_segment] =
      /(?:(?:[a-z0-9]|[^\x00-\x7f])(?:(?:[a-z0-9_\-]|[^\x00-\x7f])*(?:[a-z0-9]|[^\x00-\x7f]))?)/ix
    REGEXEN[:validate_url_unicode_domain_segment] =
      /(?:(?:[a-z0-9]|[^\x00-\x7f])(?:(?:[a-z0-9\-]|[^\x00-\x7f])*(?:[a-z0-9]|[^\x00-\x7f]))?)/ix
    REGEXEN[:validate_url_unicode_domain_tld] =
      /(?:(?:[a-z]|[^\x00-\x7f])(?:(?:[a-z0-9\-]|[^\x00-\x7f])*(?:[a-z0-9]|[^\x00-\x7f]))?)/ix
    REGEXEN[:validate_url_unicode_domain] = /(?:(?:#{REGEXEN[:validate_url_unicode_subdomain_segment]}\.)*
                                             (?:#{REGEXEN[:validate_url_unicode_domain_segment]}\.)
                                             #{REGEXEN[:validate_url_unicode_domain_tld]})/iox

    REGEXEN[:validate_url_unicode_host] = /(?:
      #{REGEXEN[:validate_url_ip]}|
      #{REGEXEN[:validate_url_unicode_domain]}
    )/iox

    REGEXEN[:validate_url_port] = /[0-9]{1,5}/

    REGEXEN[:validate_url_unicode_authority] = %r{
      (?:(#{REGEXEN[:validate_url_userinfo]})@)?     #  $1 userinfo
      (#{REGEXEN[:validate_url_unicode_host]})       #  $2 host
      (?::(#{REGEXEN[:validate_url_port]}))?         #  $3 port
    }iox

    REGEXEN[:validate_url_authority] = %r{
      (?:(#{REGEXEN[:validate_url_userinfo]})@)?     #  $1 userinfo
      (#{REGEXEN[:validate_url_host]})               #  $2 host
      (?::(#{REGEXEN[:validate_url_port]}))?         #  $3 port
    }iox

    REGEXEN[:validate_url_path] = %r{(/#{REGEXEN[:validate_url_pchar]}*)*}i
    REGEXEN[:validate_url_query] = %r{(#{REGEXEN[:validate_url_pchar]}|/|\?)*}i
    REGEXEN[:validate_url_fragment] = %r{(#{REGEXEN[:validate_url_pchar]}|/|\?)*}i

    # Modified version of RFC 3986 Appendix B
    REGEXEN[:validate_url_unencoded] = %r{
      \A                                #  Full URL
      (?:
        ([^:/?#]+):                    #  $1 Scheme
      )
      (?://
        ([^/?#]*)                      #  $2 Authority
      )
      ([^?#]*)                         #  $3 Path
      (?:
        \?([^#]*)                      #  $4 Query
      )?
      (?:
        \#(.*)                         #  $5 Fragment
      )?\Z
    }ix

    REGEXEN.each_pair{|k,v| v.freeze }

    # Return the regular expression for a given <tt>key</tt>. If the <tt>key</tt>
    # is not a known symbol a <tt>nil</tt> will be returned.
    def self.[](key)
      REGEXEN[key]
    end
  end
end
