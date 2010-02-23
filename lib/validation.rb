module Twitter
  module Validation
    MAX_LENGTH = 140

    # Character not allowed in Tweets
    INVALID_CHARACTERS = [
      0xFFFE, 0xFEFF, # BOM
      0xFFFF,         # Special
      0x202A, 0x202B, 0x202C, 0x202D, 0x202E # Directional change
    ].map{|cp| [cp].pack('U') }.freeze

    # Returns the length of the string as it would be displayed. This is equivilent to the length of the Unicode NFC
    # (See: http://www.unicode.org/reports/tr15). This is needed in order to consistently calculate the length of a
    # string no matter which actual form was transmitted. For example:
    #
    #     U+0065  Latin Small Letter E
    # +   U+0301  Combining Acute Accent
    # ----------
    # =   2 bytes, 2 characters, displayed as é (1 visual glyph)
    #     … The NFC of {U+0065, U+0301} is {U+00E9}, which is a single chracter and a +display_length+ of 1
    #
    # The string could also contain U+00E9 already, in which case the canonicalization will not change the value.
    #
    def tweet_length(text)
      ActiveSupport::Multibyte::Chars.new(text).normalize(:c).length
    end

    # Check the <tt>text</tt> for any reason that it may not be valid as a Tweet. This is meant as a pre-validation
    # before posting to api.twitter.com. There are several server-side reasons for Tweets to fail but this pre-validation
    # will allow quicker feedback.
    #
    # Returns <tt>false</tt> if this <tt>text</tt> is valid. Otherwise one of the following Symbols will be returned:
    #
    #   <tt>:too_long</tt>:: if the <tt>text</tt> is too long
    #   <tt>:empty</tt>:: if the <tt>text</tt> is nil or empty
    #   <tt>:invalid_characters</tt>:: if the <tt>text</tt> contains non-Unicode or any of the disallowed Unicode characters
    def tweet_invalid?(text)
      return :empty if text.blank?
      begin
        return :too_long if tweet_length(text) > MAX_LENGTH
        return :invalid_characters if INVALID_CHARACTERS.any?{|invalid_char| text.include?(invalid_char) }
      rescue ArgumentError, ActiveSupport::Multibyte::EncodingError => e
        # non-Unicode value.
        return :invalid_characters
      end

      return false
    end
  end
end
