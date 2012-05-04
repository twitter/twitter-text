# encoding: UTF-8

module Twitter
  # A collection of regular expressions for parsing Tweet text. The regular expression
  # list is frozen at load time to ensure immutability. These reular expressions are
  # used throughout the <tt>Twitter</tt> classes. Special care has been taken to make
  # sure these reular expressions work with Tweets in all languages.
  class Regex
    REGEXEN = {} # :nodoc:

    def self.regex_range(from, to = nil) # :nodoc:
      if $RUBY_1_9
        if to
          "\\u{#{from.to_s(16).rjust(4, '0')}}-\\u{#{to.to_s(16).rjust(4, '0')}}"
        else
          "\\u{#{from.to_s(16).rjust(4, '0')}}"
        end
      else
        if to
          [from].pack('U') + '-' + [to].pack('U')
        else
          [from].pack('U')
        end
      end
   end

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
    ].flatten.map{|c| [c].pack('U*')}.freeze
    REGEXEN[:spaces] = /[#{UNICODE_SPACES.join('')}]/o

    # Character not allowed in Tweets
    INVALID_CHARACTERS = [
      0xFFFE, 0xFEFF, # BOM
      0xFFFF,         # Special
      0x202A, 0x202B, 0x202C, 0x202D, 0x202E # Directional change
    ].map{|cp| [cp].pack('U') }.freeze
    REGEXEN[:invalid_control_characters] = /[#{INVALID_CHARACTERS.join('')}]/o

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
    LATIN_ACCENTS = [
          regex_range(0xc0, 0xd6),
          regex_range(0xd8, 0xf6),
          regex_range(0xf8, 0xff),
          regex_range(0x0100, 0x024f),
          regex_range(0x0253, 0x0254),
          regex_range(0x0256, 0x0257),
          regex_range(0x0259),
          regex_range(0x025b),
          regex_range(0x0263),
          regex_range(0x0268),
          regex_range(0x026f),
          regex_range(0x0272),
          regex_range(0x0289),
          regex_range(0x028b),
          regex_range(0x02bb),
          regex_range(0x0300, 0x036f),
          regex_range(0x1e00, 0x1eff)
    ].join('').freeze

    NON_LATIN_HASHTAG_CHARS = [
      # Cyrillic (Russian, Ukrainian, etc.)
      regex_range(0x0400, 0x04ff), # Cyrillic
      regex_range(0x0500, 0x0527), # Cyrillic Supplement
      regex_range(0x2de0, 0x2dff), # Cyrillic Extended A
      regex_range(0xa640, 0xa69f), # Cyrillic Extended B
      regex_range(0x0591, 0x05bf), # Hebrew
      regex_range(0x05c1, 0x05c2),
      regex_range(0x05c4, 0x05c5),
      regex_range(0x05c7),
      regex_range(0x05d0, 0x05ea),
      regex_range(0x05f0, 0x05f4),
      regex_range(0xfb12, 0xfb28), # Hebrew Presentation Forms
      regex_range(0xfb2a, 0xfb36),
      regex_range(0xfb38, 0xfb3c),
      regex_range(0xfb3e),
      regex_range(0xfb40, 0xfb41),
      regex_range(0xfb43, 0xfb44),
      regex_range(0xfb46, 0xfb4f),
      regex_range(0x0610, 0x061a), # Arabic
      regex_range(0x0620, 0x065f),
      regex_range(0x066e, 0x06d3),
      regex_range(0x06d5, 0x06dc),
      regex_range(0x06de, 0x06e8),
      regex_range(0x06ea, 0x06ef),
      regex_range(0x06fa, 0x06fc),
      regex_range(0x06ff),
      regex_range(0x0750, 0x077f), # Arabic Supplement
      regex_range(0x08a0),         # Arabic Extended A
      regex_range(0x08a2, 0x08ac),
      regex_range(0x08e4, 0x08fe),
      regex_range(0xfb50, 0xfbb1), # Arabic Pres. Forms A
      regex_range(0xfbd3, 0xfd3d),
      regex_range(0xfd50, 0xfd8f),
      regex_range(0xfd92, 0xfdc7),
      regex_range(0xfdf0, 0xfdfb),
      regex_range(0xfe70, 0xfe74), # Arabic Pres. Forms B
      regex_range(0xfe76, 0xfefc),
      regex_range(0x200c, 0x200c), # Zero-Width Non-Joiner
      regex_range(0x0e01, 0x0e3a), # Thai
      regex_range(0x0e40, 0x0e4e), # Hangul (Korean)
      regex_range(0x1100, 0x11ff), # Hangul Jamo
      regex_range(0x3130, 0x3185), # Hangul Compatibility Jamo
      regex_range(0xA960, 0xA97F), # Hangul Jamo Extended-A
      regex_range(0xAC00, 0xD7AF), # Hangul Syllables
      regex_range(0xD7B0, 0xD7FF), # Hangul Jamo Extended-B
      regex_range(0xFFA1, 0xFFDC)  # Half-width Hangul
    ].join('').freeze
    REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o

    CJ_HASHTAG_CHARACTERS = [
      regex_range(0x30A1, 0x30FA), regex_range(0x30FC, 0x30FE), # Katakana (full-width)
      regex_range(0xFF66, 0xFF9F), # Katakana (half-width)
      regex_range(0xFF10, 0xFF19), regex_range(0xFF21, 0xFF3A), regex_range(0xFF41, 0xFF5A), # Latin (full-width)
      regex_range(0x3041, 0x3096), regex_range(0x3099, 0x309E), # Hiragana
      regex_range(0x3400, 0x4DBF), # Kanji (CJK Extension A)
      regex_range(0x4E00, 0x9FFF), # Kanji (Unified)
      regex_range(0x20000, 0x2A6DF), # Kanji (CJK Extension B)
      regex_range(0x2A700, 0x2B73F), # Kanji (CJK Extension C)
      regex_range(0x2B740, 0x2B81F), # Kanji (CJK Extension D)
      regex_range(0x2F800, 0x2FA1F), regex_range(0x3003), regex_range(0x3005), regex_range(0x303B) # Kanji (CJK supplement)
    ].join('').freeze

    PUNCTUATION_CHARS = '!"#$%&\'()*+,-./:;<=>?@\[\]^_\`{|}~'
    SPACE_CHARS = " \t\n\x0B\f\r"
    CTRL_CHARS = "\x00-\x1F\x7F"

    # A hashtag must contain latin characters, numbers and underscores, but not all numbers.
    HASHTAG_ALPHA = /[a-z_#{LATIN_ACCENTS}#{NON_LATIN_HASHTAG_CHARS}#{CJ_HASHTAG_CHARACTERS}]/io
    HASHTAG_ALPHANUMERIC = /[a-z0-9_#{LATIN_ACCENTS}#{NON_LATIN_HASHTAG_CHARS}#{CJ_HASHTAG_CHARACTERS}]/io
    HASHTAG_BOUNDARY = /\A|\z|[^&a-z0-9_#{LATIN_ACCENTS}#{NON_LATIN_HASHTAG_CHARS}#{CJ_HASHTAG_CHARACTERS}]/o

    HASHTAG = /(#{HASHTAG_BOUNDARY})(#|＃)(#{HASHTAG_ALPHANUMERIC}*#{HASHTAG_ALPHA}#{HASHTAG_ALPHANUMERIC}*)/io

    REGEXEN[:valid_hashtag] = /#{HASHTAG}/io
    # Used in Extractor for final filtering
    REGEXEN[:end_hashtag_match] = /\A(?:[#＃]|:\/\/)/o

    REGEXEN[:valid_mention_preceding_chars] = /(?:[^a-zA-Z0-9_!#\$%&*@＠]|^|RT:?)/o
    REGEXEN[:at_signs] = /[@＠]/
    REGEXEN[:valid_mention_or_list] = /
      (#{REGEXEN[:valid_mention_preceding_chars]})  # $1: Preceeding character
      (#{REGEXEN[:at_signs]})                       # $2: At mark
      ([a-zA-Z0-9_]{1,20})                          # $3: Screen name
      (\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?             # $4: List (optional)
    /ox
    REGEXEN[:valid_reply] = /^(?:#{REGEXEN[:spaces]})*#{REGEXEN[:at_signs]}([a-zA-Z0-9_]{1,20})/o
    # Used in Extractor for final filtering
    REGEXEN[:end_mention_match] = /\A(?:#{REGEXEN[:at_signs]}|#{REGEXEN[:latin_accents]}|:\/\/)/o

    # URL related hash regex collection
    REGEXEN[:valid_url_preceding_chars] = /(?:[^A-Z0-9@＠$#＃#{INVALID_CHARACTERS.join('')}]|^)/io
    REGEXEN[:invalid_url_without_protocol_preceding_chars] = /[-_.\/]$/
    DOMAIN_VALID_CHARS = "[^#{PUNCTUATION_CHARS}#{SPACE_CHARS}#{CTRL_CHARS}#{INVALID_CHARACTERS.join('')}#{UNICODE_SPACES.join('')}]"
    REGEXEN[:valid_subdomain] = /(?:(?:#{DOMAIN_VALID_CHARS}(?:[_-]|#{DOMAIN_VALID_CHARS})*)?#{DOMAIN_VALID_CHARS}\.)/io
    REGEXEN[:valid_domain_name] = /(?:(?:#{DOMAIN_VALID_CHARS}(?:[-]|#{DOMAIN_VALID_CHARS})*)?#{DOMAIN_VALID_CHARS}\.)/io

    REGEXEN[:valid_gTLD] = /(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)(?=[^0-9a-z]|$))/i
    REGEXEN[:valid_ccTLD] = %r{
      (?:
        (?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|
        ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|
        gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|
        lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|
        pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|tc|td|tf|tg|th|
        tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)
        (?=[^0-9a-z]|$)
      )
    }ix
    REGEXEN[:valid_punycode] = /(?:xn--[0-9a-z]+)/i

    REGEXEN[:valid_domain] = /(?:
      #{REGEXEN[:valid_subdomain]}*#{REGEXEN[:valid_domain_name]}
      (?:#{REGEXEN[:valid_gTLD]}|#{REGEXEN[:valid_ccTLD]}|#{REGEXEN[:valid_punycode]})
    )/iox

    # This is used in Extractor
    REGEXEN[:valid_ascii_domain] = /
      (?:(?:[A-Za-z0-9\-_]|#{REGEXEN[:latin_accents]})+\.)+
      (?:#{REGEXEN[:valid_gTLD]}|#{REGEXEN[:valid_ccTLD]}|#{REGEXEN[:valid_punycode]})
    /iox

    # This is used in Extractor for stricter t.co URL extraction
    REGEXEN[:valid_tco_url] = /^https?:\/\/t\.co\/[a-z0-9]+/i

    # This is used in Extractor to filter out unwanted URLs.
    REGEXEN[:invalid_short_domain] = /\A#{REGEXEN[:valid_domain_name]}#{REGEXEN[:valid_ccTLD]}\Z/io

    REGEXEN[:valid_port_number] = /[0-9]+/

    REGEXEN[:valid_general_url_path_chars] = /[a-z0-9!\*';:=\+\,\.\$\/%#\[\]\-_~&|#{LATIN_ACCENTS}]/io
    # Allow URL paths to contain balanced parens
    #  1. Used in Wikipedia URLs like /Primer_(film)
    #  2. Used in IIS sessions like /S(dfd346)/
    REGEXEN[:valid_url_balanced_parens] = /\(#{REGEXEN[:valid_general_url_path_chars]}+\)/io
    # Valid end-of-path chracters (so /foo. does not gobble the period).
    #   1. Allow =&# for empty URL parameters and other URL-join artifacts
    REGEXEN[:valid_url_path_ending_chars] = /[a-z0-9=_#\/\+\-#{LATIN_ACCENTS}]|(?:#{REGEXEN[:valid_url_balanced_parens]})/io
    # Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
    REGEXEN[:valid_url_path] = /(?:
      (?:
        #{REGEXEN[:valid_general_url_path_chars]}*
        (?:#{REGEXEN[:valid_url_balanced_parens]} #{REGEXEN[:valid_general_url_path_chars]}*)*
        #{REGEXEN[:valid_url_path_ending_chars]}
      )|(?:@#{REGEXEN[:valid_general_url_path_chars]}+\/)
    )/iox

    REGEXEN[:valid_url_query_chars] = /[a-z0-9!?\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i
    REGEXEN[:valid_url_query_ending_chars] = /[a-z0-9_&=#\/]/i
    REGEXEN[:valid_url] = %r{
      (                                                                                     #   $1 total match
        (#{REGEXEN[:valid_url_preceding_chars]})                                            #   $2 Preceeding chracter
        (                                                                                   #   $3 URL
          (https?:\/\/)?                                                                    #   $4 Protocol (optional)
          (#{REGEXEN[:valid_domain]})                                                       #   $5 Domain(s)
          (?::(#{REGEXEN[:valid_port_number]}))?                                            #   $6 Port number (optional)
          (/#{REGEXEN[:valid_url_path]}*)?                                                  #   $7 URL Path and anchor
          (\?#{REGEXEN[:valid_url_query_chars]}*#{REGEXEN[:valid_url_query_ending_chars]})? #   $8 Query String
        )
      )
    }iox;

    REGEXEN[:cashtag] = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i
    REGEXEN[:valid_cashtag] = /(?:^|#{REGEXEN[:spaces]})\$(#{REGEXEN[:cashtag]})(?=$|\s|[#{PUNCTUATION_CHARS}])/i

    # These URL validation pattern strings are based on the ABNF from RFC 3986
    REGEXEN[:validate_url_unreserved] = /[a-z0-9\-._~]/i
    REGEXEN[:validate_url_pct_encoded] = /(?:%[0-9a-f]{2})/i
    REGEXEN[:validate_url_sub_delims] = /[!$&'()*+,;=]/i
    REGEXEN[:validate_url_pchar] = /(?:
      #{REGEXEN[:validate_url_unreserved]}|
      #{REGEXEN[:validate_url_pct_encoded]}|
      #{REGEXEN[:validate_url_sub_delims]}|
      [:\|@]
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
        ([^:/?#]+)://                  #  $1 Scheme
      )?
      ([^/?#]*)                        #  $2 Authority
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
