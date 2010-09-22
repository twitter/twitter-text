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

    major, minor, patch = RUBY_VERSION.split(/\./)
    if major.to_i >= 1 && minor.to_i >= 9
      REGEXEN[:list_name] = /[a-zA-Z][a-zA-Z0-9_\-\u0080-\u00ff]{0,24}/
    else
      # This line barfs at compile time in Ruby 1.9.
      REGEXEN[:list_name] = eval("/[a-zA-Z][a-zA-Z0-9_\\-\x80-\xff]{0,24}/")
    end

    # Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
    LATIN_ACCENTS = [(0xc0..0xd6).to_a, (0xd8..0xf6).to_a, (0xf8..0xff).to_a].flatten.pack('U*').freeze
    REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o

    # Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
    HASHTAG_CHARACTERS = /[a-z0-9_#{LATIN_ACCENTS}]/io
    REGEXEN[:auto_link_hashtags] = /(^|[^0-9A-Z&\/]+)(#|＃)([0-9A-Z_]*[A-Z_]+#{HASHTAG_CHARACTERS}*)/io
    REGEXEN[:auto_link_usernames_or_lists] = /([^a-zA-Z0-9_]|^)([@＠]+)([a-zA-Z0-9_]{1,20})(\/#{REGEXEN[:list_name]})?/o
    REGEXEN[:auto_link_emoticon] = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/

    # URL related hash regex collection
    REGEXEN[:valid_preceding_chars] = /(?:[^\/"':!=]|^|\:)/
    REGEXEN[:valid_domain] = /(?:[^[:punct:]\s][\.-](?=[^[:punct:]\s])|[^[:punct:]\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i

    REGEXEN[:valid_general_url_path_chars] = /[a-z0-9!\*';:=\+\$\/%#\[\]\-_,~]/i
    # Allow URL paths to contain balanced parens
    #  1. Used in Wikipedia URLs like /Primer_(film)
    #  2. Used in IIS sessions like /S(dfd346)/
    REGEXEN[:wikipedia_disambiguation] = /(?:\(#{REGEXEN[:valid_general_url_path_chars]}+\))/i
    # Allow @ in a url, but only in the middle. Catch things like http://example.com/@user
    REGEXEN[:valid_url_path_chars] = /(?:
      #{REGEXEN[:wikipedia_disambiguation]}|
      @#{REGEXEN[:valid_general_url_path_chars]}+\/|
      [\.\,]?#{REGEXEN[:valid_general_url_path_chars]}
    )/ix
    # Valid end-of-path chracters (so /foo. does not gobble the period).
    #   1. Allow =&# for empty URL parameters and other URL-join artifacts
    REGEXEN[:valid_url_path_ending_chars] = /[a-z0-9=#\/]/i
    REGEXEN[:valid_url_query_chars] = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/i
    REGEXEN[:valid_url_query_ending_chars] = /[a-z0-9_&=#]/i
    REGEXEN[:valid_url] = %r{
      (                                                                                     #   $1 total match
        (#{REGEXEN[:valid_preceding_chars]})                                                #   $2 Preceeding chracter
        (                                                                                   #   $3 URL
          (https?:\/\/|www\.)                                                               #   $4 Protocol or beginning
          (#{REGEXEN[:valid_domain]})                                                       #   $5 Domain(s) and optional post number
          (/#{REGEXEN[:valid_url_path_chars]}*
            #{REGEXEN[:valid_url_path_ending_chars]}?
          )?                                                                                #   $6 URL Path
          (\?#{REGEXEN[:valid_url_query_chars]}*#{REGEXEN[:valid_url_query_ending_chars]})? #   $7 Query String
        )
      )
    }iox;

    REGEXEN.each_pair{|k,v| v.freeze }

    # Return the regular expression for a given <tt>key</tt>. If the <tt>key</tt>
    # is not a known symbol a <tt>nil</tt> will be returned.
    def self.[](key)
      REGEXEN[key]
    end
  end
end
