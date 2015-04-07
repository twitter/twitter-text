# encoding: UTF-8

module Twitter
  # A collection of regular expressions for parsing Tweet text. The regular expression
  # list is frozen at load time to ensure immutability. These regular expressions are
  # used throughout the <tt>Twitter</tt> classes. Special care has been taken to make
  # sure these reular expressions work with Tweets in all languages.
  class Regex
    require 'yaml'

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

    TLDS = YAML.load_file(
      File.join(
        File.expand_path('../../..', __FILE__), # project root
        'lib', 'assets', 'tld_lib.yml'
      )
    )

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

    major, minor, _patch = RUBY_VERSION.split('.')
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
    REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o

    RTL_CHARACTERS = [
      regex_range(0x0600,0x06FF),
      regex_range(0x0750,0x077F),
      regex_range(0x0590,0x05FF),
      regex_range(0xFE70,0xFEFF)
    ].join('').freeze

    PUNCTUATION_CHARS = '!"#$%&\'()*+,-./:;<=>?@\[\]^_\`{|}~'
    SPACE_CHARS = " \t\n\x0B\f\r"
    CTRL_CHARS = "\x00-\x1F\x7F"

    # A hashtag must contain at least one unicode letter or mark, as well as numbers, underscores, and select special characters.
    HASHTAG_ALPHA = /[\p{L}\p{M}]/
    HASHTAG_ALPHANUMERIC = /[\p{L}\p{M}\p{Nd}_\u200c\u200d\u0482\ua673\ua67e\u05be\u05f3\u05f4\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7]/
    HASHTAG_BOUNDARY = /\A|\z|[^&\p{L}\p{M}\p{Nd}_\u200c\u200d\u0482\ua673\ua67e\u05be\u05f3\u05f4\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7]/

    HASHTAG = /(#{HASHTAG_BOUNDARY})(#|＃)(#{HASHTAG_ALPHANUMERIC}*#{HASHTAG_ALPHA}#{HASHTAG_ALPHANUMERIC}*)/io

    REGEXEN[:valid_hashtag] = /#{HASHTAG}/io
    # Used in Extractor for final filtering
    REGEXEN[:end_hashtag_match] = /\A(?:[#＃]|:\/\/)/o

    REGEXEN[:valid_mention_preceding_chars] = /(?:[^a-zA-Z0-9_!#\$%&*@＠]|^|[rR][tT]:?)/o
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

    REGEXEN[:valid_gTLD] = %r{
      (?:
        (?:#{TLDS['generic'].join('|')})
        (?=[^0-9a-z@]|$)
      )
    }ix

    REGEXEN[:valid_ccTLD] = %r{
      (?:
        (?:#{TLDS['country'].join('|')})
        (?=[^0-9a-z@]|$)
      )
    }ix
    REGEXEN[:valid_punycode] = /(?:xn--[0-9a-z]+)/i

    REGEXEN[:valid_special_cctld] = %r{
      (?:
        (?:co|tv)
        (?=[^0-9a-z@]|$)
      )
    }ix

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
    REGEXEN[:valid_special_short_domain] = /\A#{REGEXEN[:valid_domain_name]}#{REGEXEN[:valid_special_cctld]}\Z/io

    REGEXEN[:valid_port_number] = /[0-9]+/

    REGEXEN[:valid_general_url_path_chars] = /[a-z0-9!\*';:=\+\,\.\$\/%#\[\]\-_~&|@#{LATIN_ACCENTS}]/io
    # Allow URL paths to contain up to two nested levels of balanced parens
    #  1. Used in Wikipedia URLs like /Primer_(film)
    #  2. Used in IIS sessions like /S(dfd346)/
    #  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
    REGEXEN[:valid_url_balanced_parens] = /
      \(
        (?:
          #{REGEXEN[:valid_general_url_path_chars]}+
          |
          # allow one nested level of balanced parentheses
          (?:
            #{REGEXEN[:valid_general_url_path_chars]}*
            \(
              #{REGEXEN[:valid_general_url_path_chars]}+
            \)
            #{REGEXEN[:valid_general_url_path_chars]}*
          )
        )
      \)
    /iox
    # Valid end-of-path chracters (so /foo. does not gobble the period).
    #   1. Allow =&# for empty URL parameters and other URL-join artifacts
    REGEXEN[:valid_url_path_ending_chars] = /[a-z0-9=_#\/\+\-#{LATIN_ACCENTS}]|(?:#{REGEXEN[:valid_url_balanced_parens]})/io
    REGEXEN[:valid_url_path] = /(?:
      (?:
        #{REGEXEN[:valid_general_url_path_chars]}*
        (?:#{REGEXEN[:valid_url_balanced_parens]} #{REGEXEN[:valid_general_url_path_chars]}*)*
        #{REGEXEN[:valid_url_path_ending_chars]}
      )|(?:#{REGEXEN[:valid_general_url_path_chars]}+\/)
    )/iox

    REGEXEN[:valid_url_query_chars] = /[a-z0-9!?\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|@]/i
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
    }iox

    REGEXEN[:cashtag] = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i
    REGEXEN[:valid_cashtag] = /(^|#{REGEXEN[:spaces]})(\$)(#{REGEXEN[:cashtag]})(?=$|\s|[#{PUNCTUATION_CHARS}])/i

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

    REGEXEN[:rtl_chars] = /[#{RTL_CHARACTERS}]/io

    REGEXEN.each_pair{|k,v| v.freeze }

    # Return the regular expression for a given <tt>key</tt>. If the <tt>key</tt>
    # is not a known symbol a <tt>nil</tt> will be returned.
    def self.[](key)
      REGEXEN[key]
    end
  end
end
