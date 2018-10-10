# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

require 'unf'

module Twitter
  module TwitterText
    module Validation extend self
      DEFAULT_TCO_URL_LENGTHS = {
        :short_url_length => 23,
      }

      # :weighted_length the weighted length of tweet based on weights specified in the config
      # :valid If tweet is valid
      # :permillage permillage of the tweet over the max length specified in config
      # :valid_range_start beginning of valid text
      # :valid_range_end End index of valid part of the tweet text (inclusive)
      # :display_range_start beginning index of display text
      # :display_range_end end index of display text (inclusive)
      class ParseResults < Hash

        RESULT_PARAMS = [:weighted_length, :valid, :permillage, :valid_range_start, :valid_range_end, :display_range_start, :display_range_end]

        def self.empty
          return ParseResults.new(weighted_length: 0, permillage: 0, valid: true, display_range_start: 0, display_range_end: 0, valid_range_start: 0, valid_range_end: 0)
        end

        def initialize(params = {})
          RESULT_PARAMS.each do |key|
            super[key] = params[key] if params.key?(key)
          end
        end
      end

      # Parse input text and return hash with descriptive parameters populated.
      def parse_tweet(text, options = {})
        options = DEFAULT_TCO_URL_LENGTHS.merge(options)
        config = options[:config] || Twitter::TwitterText::Configuration.default_configuration
        normalized_text = text.to_nfc
        unless (normalized_text.length > 0)
          ParseResults.empty()
        end

        scale = config.scale
        max_weighted_tweet_length = config.max_weighted_tweet_length
        scaled_max_weighted_tweet_length = max_weighted_tweet_length * scale
        transformed_url_length = config.transformed_url_length * scale
        ranges = config.ranges

        url_entities = Twitter::TwitterText::Extractor.extract_urls_with_indices(normalized_text)
        emoji_entities = config.emoji_parsing_enabled ? Twitter::TwitterText::Extractor.extract_emoji_with_indices(normalized_text) : []

        has_invalid_chars = false
        weighted_count = 0
        offset = 0
        display_offset = 0
        valid_offset = 0

        while offset < normalized_text.codepoint_length
          # Reset the default char weight each pass through the loop
          char_weight = config.default_weight
          entity_length = 0

          url_entities.each do |url_entity|
            if url_entity[:indices].first == offset
              entity_length = url_entity[:indices].last - url_entity[:indices].first
              weighted_count += transformed_url_length
              offset += entity_length
              display_offset += entity_length
              if weighted_count <= scaled_max_weighted_tweet_length
                valid_offset += entity_length
              end
              # Finding a match breaks the loop
              break
            end
          end

          emoji_entities.each do |emoji_entity|
            if emoji_entity[:indices].first == offset
              entity_length = emoji_entity[:indices].last - emoji_entity[:indices].first
              weighted_count += char_weight # the default weight
              offset += entity_length
              display_offset += entity_length
              if weighted_count <= scaled_max_weighted_tweet_length
                valid_offset += entity_length
              end
              # Finding a match breaks the loop
              break
            end
          end

          next if entity_length > 0

          if offset < normalized_text.codepoint_length
            code_point = normalized_text[offset]

            ranges.each do |range|
              if range.contains?(code_point.unpack("U").first)
                char_weight = range.weight
                break
              end
            end

            weighted_count += char_weight

            has_invalid_chars = contains_invalid?(code_point) unless has_invalid_chars
            codepoint_length = code_point.codepoint_length
            offset += codepoint_length
            display_offset += codepoint_length
            #          index += codepoint_length

            if !has_invalid_chars && (weighted_count <= scaled_max_weighted_tweet_length)
              valid_offset += codepoint_length
            end
          end
        end

        normalized_text_offset = text.codepoint_length - normalized_text.codepoint_length
        scaled_weighted_length = weighted_count / scale
        is_valid = !has_invalid_chars && (scaled_weighted_length <= max_weighted_tweet_length)
        permillage = scaled_weighted_length * 1000 / max_weighted_tweet_length

        return ParseResults.new(weighted_length: scaled_weighted_length, permillage: permillage, valid: is_valid, display_range_start: 0, display_range_end: (display_offset + normalized_text_offset - 1), valid_range_start: 0, valid_range_end: (valid_offset + normalized_text_offset - 1))
      end

      def contains_invalid?(text)
        return false if !text || text.empty?
        begin
          return true if Twitter::TwitterText::Regex::INVALID_CHARACTERS.any?{|invalid_char| text.include?(invalid_char) }
        rescue ArgumentError
          # non-Unicode value.
          return true
        end
        return false
      end

      def valid_username?(username)
        return false if !username || username.empty?

        extracted = Twitter::TwitterText::Extractor.extract_mentioned_screen_names(username)
        # Should extract the username minus the @ sign, hence the [1..-1]
        extracted.size == 1 && extracted.first == username[1..-1]
      end

      VALID_LIST_RE = /\A#{Twitter::TwitterText::Regex[:valid_mention_or_list]}\z/o
      def valid_list?(username_list)
        match = username_list.match(VALID_LIST_RE)
        # Must have matched and had nothing before or after
        !!(match && match[1] == "" && match[4] && !match[4].empty?)
      end

      def valid_hashtag?(hashtag)
        return false if !hashtag || hashtag.empty?

        extracted = Twitter::TwitterText::Extractor.extract_hashtags(hashtag)
        # Should extract the hashtag minus the # sign, hence the [1..-1]
        extracted.size == 1 && extracted.first == hashtag[1..-1]
      end

      def valid_url?(url, unicode_domains=true, require_protocol=true)
        return false if !url || url.empty?

        url_parts = url.match(Twitter::TwitterText::Regex[:validate_url_unencoded])
        return false unless (url_parts && url_parts.to_s == url)

        scheme, authority, path, query, fragment = url_parts.captures

        return false unless ((!require_protocol ||
                              (valid_match?(scheme, Twitter::TwitterText::Regex[:validate_url_scheme]) && scheme.match(/\Ahttps?\Z/i))) &&
                             valid_match?(path, Twitter::TwitterText::Regex[:validate_url_path]) &&
                             valid_match?(query, Twitter::TwitterText::Regex[:validate_url_query], true) &&
                             valid_match?(fragment, Twitter::TwitterText::Regex[:validate_url_fragment], true))

        return (unicode_domains && valid_match?(authority, Twitter::TwitterText::Regex[:validate_url_unicode_authority])) ||
               (!unicode_domains && valid_match?(authority, Twitter::TwitterText::Regex[:validate_url_authority]))
      end

      # These methods are deprecated, will be removed in future.
      extend Deprecation

      MAX_LENGTH_LEGACY = 140

      # DEPRECATED: Please use parse_text instead.
      #
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
      def tweet_length(text, options = {})
        options = DEFAULT_TCO_URL_LENGTHS.merge(options)

        length = text.to_nfc.unpack("U*").length

        Twitter::TwitterText::Extractor.extract_urls_with_indices(text) do |url, start_position, end_position|
          length += start_position - end_position
          length += options[:short_url_length] if url.length > 0
        end

        length
      end
      deprecate :tweet_length, :parse_tweet

      # DEPRECATED: Please use parse_text instead.
      #
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
        return :empty if !text || text.empty?
        begin
          return :too_long if tweet_length(text) > MAX_LENGTH_LEGACY
          return :invalid_characters if Twitter::TwitterText::Regex::INVALID_CHARACTERS.any?{|invalid_char| text.include?(invalid_char) }
        rescue ArgumentError
          # non-Unicode value.
          return :invalid_characters
        end

        return false
      end
      deprecate :tweet_invalid?, :parse_tweet

      def valid_tweet_text?(text)
        !tweet_invalid?(text)
      end
      deprecate :valid_tweet_text?, :parse_tweet

      private

      def valid_match?(string, regex, optional=false)
        return (string && string.match(regex) && $~.to_s == string) unless optional

        !(string && (!string.match(regex) || $~.to_s != string))
      end
    end
  end
end
