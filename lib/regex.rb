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
    REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o

    REGEXEN[:end_screen_name_match] = /^(?:#{REGEXEN[:at_signs]}|#{REGEXEN[:latin_accents]}|:\/\/)/o

    # Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
    HASHTAG_CHARACTERS = /[a-z0-9_#{LATIN_ACCENTS}]/io
    REGEXEN[:auto_link_hashtags] = /(^|[^0-9A-Z&\/\?]+)(#|＃)([0-9a-z_]*[a-z_]+#{HASHTAG_CHARACTERS}*)/io
    REGEXEN[:auto_link_usernames_or_lists] = /([^a-zA-Z0-9_]|^|RT:?)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?/o
    REGEXEN[:auto_link_emoticon] = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/

    # URL related hash regex collection
    REGEXEN[:valid_preceding_chars] = /(?:[^-\/"':!=A-Z0-9_@＠]|^|\:)/i
    REGEXEN[:valid_domain] = /(?:[^[:punct:]\s][\.-](?=[^[:punct:]\s])|[^[:punct:]\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i

    REGEXEN[:valid_general_url_path_chars] = /[a-z0-9!\*';:=\+\,\$\/%#\[\]\-_~|]/i
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
    )/ix

    REGEXEN[:validate_url_scheme] = /(?:[a-z][a-z0-9+\-.]*)/i
    REGEXEN[:validate_url_userinfo] = /(?:
      #{REGEXEN[:validate_url_unreserved]}|
      #{REGEXEN[:validate_url_pct_encoded]}|
      #{REGEXEN[:validate_url_sub_delims]}|
      :
    )*/ix

    REGEXEN[:validate_url_dec_octet] = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i
    REGEXEN[:validate_url_ipv4] = /(?:#{REGEXEN[:validate_url_dec_octet]}(?:\.#{REGEXEN[:validate_url_dec_octet]}){3})/i

    # Punting on real IPv6 validation for now
    REGEXEN[:validate_url_ipv6] = /(?:\[[a-f0-9:\.]\])/i

    # Also punting on IPvFuture for now
    REGEXEN[:validate_url_ip] = /(?:
      #{REGEXEN[:validate_url_ipv4]}|
      #{REGEXEN[:validate_url_ipv6]}
    )/ix

    # This is more strict than the rfc specifies
    REGEXEN[:validate_url_domain_segment] = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i
    REGEXEN[:validate_url_domain] = /(?:#{REGEXEN[:validate_url_domain_segment]}\.?)+/i

    REGEXEN[:validate_url_host] = /(?:
      #{REGEXEN[:validate_url_ip]}|
      #{REGEXEN[:validate_url_domain]}
    )/ix

    # Unencoded internationalized domains - this doesn't check for invalid UTF sequences
    REGEXEN[:validate_url_unicode_domain_segment] =
      /(?:(?:[a-z0-9]|[^\x00-\x7f])(?:(?:[a-z0-9\-]|[^\x00-\x7f])*(?:[a-z0-9]|[^\x00-\x7f]))?)/ix
    REGEXEN[:validate_url_unicode_domain] = /(?:#{REGEXEN[:validate_url_unicode_domain_segment]}\.?)+/i

    REGEXEN[:validate_url_unicode_host] = /(?:
      #{REGEXEN[:validate_url_ip]}|
      #{REGEXEN[:validate_url_unicode_domain]}
    )/ix

    REGEXEN[:validate_url_port] = "[0-9]{1,5}";

    REGEXEN[:validate_url_authority] = %r{
      (?:(#{REGEXEN[:validate_url_userinfo]})@)?     #  $1 userinfo
      ([^/?#:]+)                                     #  $2 host
      (?::(#{REGEXEN[:validate_url_port]}))?         #  $3 port
    }ix

    REGEXEN[:validate_url_path] = %r{(/#{REGEXEN[:validate_url_pchar]}*)*}i
    REGEXEN[:validate_url_query] = %r{(#{REGEXEN[:validate_url_pchar]}|/|\?)*}i
    REGEXEN[:validate_url_fragment] = %r{(#{REGEXEN[:validate_url_pchar]}|/|\?)*}i

    # Modified version of RFC 3986 Appendix B
 #\A(?:([^:\/\?#]+):)(?:\/\/([^\/\?#]*))([^?#]*)(?:\?([^#]*))?(?:\#(.*))?\Z}ix
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
