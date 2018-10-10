# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require 'idn'

class String
  # Helper function to count the character length by first converting to an
  # array.  This is needed because with unicode strings, the return value
  # of length may be incorrect
  def codepoint_length
    if respond_to? :codepoints
      length
    else
      chars.kind_of?(Enumerable) ? chars.to_a.size : chars.size
    end
  end

  # Helper function to convert this string into an array of unicode code points.
  def to_codepoint_a
    @to_codepoint_a ||= if chars.kind_of?(Enumerable)
      chars.to_a
    else
      codepoint_array = []
      0.upto(codepoint_length - 1) { |i| codepoint_array << [chars.slice(i)].pack('U') }
      codepoint_array
    end
  end
end

# Helper functions to return code point offsets instead of byte offsets.
class MatchData
  def char_begin(n)
    if string.respond_to? :codepoints
      self.begin(n)
    else
      string[0, self.begin(n)].codepoint_length
    end
  end

  def char_end(n)
    if string.respond_to? :codepoints
      self.end(n)
    else
      string[0, self.end(n)].codepoint_length
    end
  end
end

module Twitter
  module TwitterText
    # A module for including Tweet parsing in a class. This module provides function for the extraction and processing
    # of usernames, lists, URLs and hashtags.
    module Extractor extend self

      # Maximum URL length as defined by Twitter's backend.
      MAX_URL_LENGTH = 4096

      # The maximum t.co path length that the Twitter backend supports.
      MAX_TCO_SLUG_LENGTH = 40

      URL_PROTOCOL_LENGTH = "https://".length

      # Remove overlapping entities.
      # This returns a new array with no overlapping entities.
      def remove_overlapping_entities(entities)
        # sort by start index
        entities = entities.sort_by{|entity| entity[:indices].first}

        # remove duplicates
        prev = nil
        entities.reject!{|entity| (prev && prev[:indices].last > entity[:indices].first) || (prev = entity) && false}
        entities
      end

      # Extracts all usernames, lists, hashtags and URLs  in the Tweet <tt>text</tt>
      # along with the indices for where the entity ocurred
      # If the <tt>text</tt> is <tt>nil</tt> or contains no entity an empty array
      # will be returned.
      #
      # If a block is given then it will be called for each entity.
      def extract_entities_with_indices(text, options = {}, &block)
        config = options[:config] || Twitter::TwitterText::Configuration.default_configuration

        # extract all entities
        entities = extract_urls_with_indices(text, options) +
                   extract_hashtags_with_indices(text, :check_url_overlap => false) +
                   extract_mentions_or_lists_with_indices(text) +
                   extract_cashtags_with_indices(text)
        entities += extract_emoji_with_indices(text) if config.emoji_parsing_enabled

        return [] if entities.empty?

        entities = remove_overlapping_entities(entities)

        entities.each(&block) if block_given?
        entities
      end

      # Extracts a list of all usernames mentioned in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no username mentions an empty array
      # will be returned.
      #
      # If a block is given then it will be called for each username.
      def extract_mentioned_screen_names(text, &block) # :yields: username
        screen_names = extract_mentioned_screen_names_with_indices(text).map{|m| m[:screen_name]}
        screen_names.each(&block) if block_given?
        screen_names
      end

      # Extracts a list of all usernames mentioned in the Tweet <tt>text</tt>
      # along with the indices for where the mention ocurred.  If the
      # <tt>text</tt> is nil or contains no username mentions, an empty array
      # will be returned.
      #
      # If a block is given, then it will be called with each username, the start
      # index, and the end index in the <tt>text</tt>.
      def extract_mentioned_screen_names_with_indices(text) # :yields: username, start, end
        return [] unless text

        possible_screen_names = []
        extract_mentions_or_lists_with_indices(text) do |screen_name, list_slug, start_position, end_position|
          next unless list_slug.empty?
          possible_screen_names << {
            :screen_name => screen_name,
            :indices => [start_position, end_position]
          }
        end

        if block_given?
          possible_screen_names.each do |mention|
            yield mention[:screen_name], mention[:indices].first, mention[:indices].last
          end
        end

        possible_screen_names
      end

      # Extracts a list of all usernames or lists mentioned in the Tweet <tt>text</tt>
      # along with the indices for where the mention ocurred.  If the
      # <tt>text</tt> is nil or contains no username or list mentions, an empty array
      # will be returned.
      #
      # If a block is given, then it will be called with each username, list slug, the start
      # index, and the end index in the <tt>text</tt>. The list_slug will be an empty stirng
      # if this is a username mention.
      def extract_mentions_or_lists_with_indices(text) # :yields: username, list_slug, start, end
        return [] unless text =~ /[@＠]/

        possible_entries = []
        text.to_s.scan(Twitter::TwitterText::Regex[:valid_mention_or_list]) do |before, at, screen_name, list_slug|
          match_data = $~
                        after = $'
          unless after =~ Twitter::TwitterText::Regex[:end_mention_match]
            start_position = match_data.char_begin(3) - 1
            end_position = match_data.char_end(list_slug.nil? ? 3 : 4)
            possible_entries << {
              :screen_name => screen_name,
              :list_slug => list_slug || "",
              :indices => [start_position, end_position]
            }
          end
        end

        if block_given?
          possible_entries.each do |mention|
            yield mention[:screen_name], mention[:list_slug], mention[:indices].first, mention[:indices].last
          end
        end

        possible_entries
      end

      # Extracts the username username replied to in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or is not a reply nil will be returned.
      #
      # If a block is given then it will be called with the username replied to (if any)
      def extract_reply_screen_name(text) # :yields: username
        return nil unless text

        possible_screen_name = text.match(Twitter::TwitterText::Regex[:valid_reply])
        return unless possible_screen_name.respond_to?(:captures)
        return if $' =~ Twitter::TwitterText::Regex[:end_mention_match]
        screen_name = possible_screen_name.captures.first
        yield screen_name if block_given?
        screen_name
      end

      # Extracts a list of all URLs included in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no URLs an empty array
      # will be returned.
      #
      # If a block is given then it will be called for each URL.
      def extract_urls(text, &block) # :yields: url
        urls = extract_urls_with_indices(text).map{|u| u[:url]}
        urls.each(&block) if block_given?
        urls
      end

      # Extracts a list of all URLs included in the Tweet <tt>text</tt> along
      # with the indices. If the <tt>text</tt> is <tt>nil</tt> or contains no
      # URLs an empty array will be returned.
      #
      # If a block is given then it will be called for each URL.
      def extract_urls_with_indices(text, options = {:extract_url_without_protocol => true}) # :yields: url, start, end
        return [] unless text && (options[:extract_url_without_protocol] ? text.index(".") : text.index(":"))
        urls = []

        text.to_s.scan(Twitter::TwitterText::Regex[:valid_url]) do |all, before, url, protocol, domain, port, path, query|
          valid_url_match_data = $~

                                  start_position = valid_url_match_data.char_begin(3)
          end_position = valid_url_match_data.char_end(3)

          # If protocol is missing and domain contains non-ASCII characters,
          # extract ASCII-only domains.
          if !protocol
            next if !options[:extract_url_without_protocol] || before =~ Twitter::TwitterText::Regex[:invalid_url_without_protocol_preceding_chars]
            last_url = nil
            domain.scan(Twitter::TwitterText::Regex[:valid_ascii_domain]) do |ascii_domain|
              next unless is_valid_domain(url.length, ascii_domain, protocol)
              last_url = {
                :url => ascii_domain,
                :indices => [start_position + $~.char_begin(0),
                             start_position + $~.char_end(0)]
              }
              urls << last_url
            end

            # no ASCII-only domain found. Skip the entire URL
            next unless last_url

            # last_url only contains domain. Need to add path and query if they exist.
            if path
              # last_url was not added. Add it to urls here.
              last_url[:url] = url.sub(domain, last_url[:url])
              last_url[:indices][1] = end_position
            end
          else
            # In the case of t.co URLs, don't allow additional path characters
            if url =~ Twitter::TwitterText::Regex[:valid_tco_url]
              next if $1 && $1.length > MAX_TCO_SLUG_LENGTH
              url = $&
                    end_position = start_position + url.codepoint_length
            end

            next unless is_valid_domain(url.length, domain, protocol)

            urls << {
              :url => url,
              :indices => [start_position, end_position]
            }
          end
        end
        urls.each{|url| yield url[:url], url[:indices].first, url[:indices].last} if block_given?
        urls
      end

      # Extracts a list of all hashtags included in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no hashtags an empty array
      # will be returned. The array returned will not include the leading <tt>#</tt>
      # character.
      #
      # If a block is given then it will be called for each hashtag.
      def extract_hashtags(text, &block) # :yields: hashtag_text
        hashtags = extract_hashtags_with_indices(text).map{|h| h[:hashtag]}
        hashtags.each(&block) if block_given?
        hashtags
      end

      # Extracts a list of all hashtags included in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no hashtags an empty array
      # will be returned. The array returned will not include the leading <tt>#</tt>
      # character.
      #
      # If a block is given then it will be called for each hashtag.
      def extract_hashtags_with_indices(text, options = {:check_url_overlap => true}) # :yields: hashtag_text, start, end
        return [] unless text =~ /[#＃]/

        tags = []
        text.scan(Twitter::TwitterText::Regex[:valid_hashtag]) do |before, hash, hash_text|
          match_data = $~
                        start_position = match_data.char_begin(2)
          end_position = match_data.char_end(3)
          after = $'
          unless after =~ Twitter::TwitterText::Regex[:end_hashtag_match]
            tags << {
              :hashtag => hash_text,
              :indices => [start_position, end_position]
            }
          end
        end

        if options[:check_url_overlap]
          # extract URLs
          urls = extract_urls_with_indices(text)
          unless urls.empty?
            tags.concat(urls)
            # remove duplicates
            tags = remove_overlapping_entities(tags)
            # remove URL entities
            tags.reject!{|entity| !entity[:hashtag] }
          end
        end

        tags.each{|tag| yield tag[:hashtag], tag[:indices].first, tag[:indices].last} if block_given?
        tags
      end

      # Extracts a list of all cashtags included in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no cashtags an empty array
      # will be returned. The array returned will not include the leading <tt>$</tt>
      # character.
      #
      # If a block is given then it will be called for each cashtag.
      def extract_cashtags(text, &block) # :yields: cashtag_text
        cashtags = extract_cashtags_with_indices(text).map{|h| h[:cashtag]}
        cashtags.each(&block) if block_given?
        cashtags
      end

      # Extracts a list of all cashtags included in the Tweet <tt>text</tt>. If the
      # <tt>text</tt> is <tt>nil</tt> or contains no cashtags an empty array
      # will be returned. The array returned will not include the leading <tt>$</tt>
      # character.
      #
      # If a block is given then it will be called for each cashtag.
      def extract_cashtags_with_indices(text) # :yields: cashtag_text, start, end
        return [] unless text =~ /\$/

        tags = []
        text.scan(Twitter::TwitterText::Regex[:valid_cashtag]) do |before, dollar, cash_text|
          match_data = $~
                        start_position = match_data.char_begin(2)
          end_position = match_data.char_end(3)
          tags << {
            :cashtag => cash_text,
            :indices => [start_position, end_position]
          }
        end

        tags.each{|tag| yield tag[:cashtag], tag[:indices].first, tag[:indices].last} if block_given?
        tags
      end

      def extract_emoji_with_indices(text) # :yields: emoji, start, end
        emoji = []
        text.scan(Twitter::TwitterText::Regex[:valid_emoji]) do |emoji_text|
          match_data = $~
                        start_position = match_data.char_begin(0)
          end_position = match_data.char_end(0)
          emoji << {
            :emoji => emoji_text,
            :indices => [start_position, end_position]
          }
        end
        emoji
      end

      def is_valid_emoji(text)
        begin
          raise ArgumentError.new("invalid empty emoji") unless text
          entities = extract_emoji_with_indices(text)
          entities.count == 1 && entities[0][:emoji] == text
        rescue Exception
          # On error don't consider this a valid domain.
          return false
        end
      end

      def is_valid_domain(url_length, domain, protocol)
        begin
          raise ArgumentError.new("invalid empty domain") unless domain
          original_domain_length = domain.length
          encoded_domain = IDN::Idna.toASCII(domain)
          updated_domain_length = encoded_domain.length
          url_length += (updated_domain_length - original_domain_length) if (updated_domain_length > original_domain_length)
          url_length += URL_PROTOCOL_LENGTH unless protocol
          url_length <= MAX_URL_LENGTH
        rescue Exception
          # On error don't consider this a valid domain.
          return false
        end
      end
    end
  end
end
