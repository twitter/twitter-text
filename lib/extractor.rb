module Twitter
  # A module for including Tweet parsing in a class. This module provides function for the extraction and processing
  # of usernames, lists, URLs and hashtags.
  module Extractor

    # Extracts a list of all usernames mentioned in the Tweet <tt>text</tt>. If the
    # <tt>text</tt> is <tt>nil</tt> or contains no username mentions an empty array
    # will be returned.
    #
    # If a block is given then it will be called for each username.
    def extract_mentioned_screen_names(text) # :yields: username
      return [] unless text

      possible_screen_names = []
      text.scan(Twitter::Regex[:extract_mentions]) do |before, sn, after|
        possible_screen_names << sn unless after =~ Twitter::Regex[:at_signs]
      end
      possible_screen_names.each{|sn| yield sn } if block_given?
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
      return [] unless text
      urls = []
      text.to_s.scan(Twitter::Regex[:valid_url]) do |all, before, url, protocol, domain, path, query|
        urls << (protocol == "www." ? "http://#{url}" : url)
      end
      urls.each{|url| yield url } if block_given?
      urls
    end

    # Extracts a list of all hashtags included in the Tweet <tt>text</tt>. If the
    # <tt>text</tt> is <tt>nil</tt> or contains no hashtags an empty array
    # will be returned. The array returned will not include the leading <tt>#</tt>
    # character.
    #
    # If a block is given then it will be called for each hashtag.
    def extract_hashtags(text) # :yields: hashtag_text
      return [] unless text

      tags = []
      text.scan(Twitter::Regex[:auto_link_hashtags]) do |before, hash, hash_text|
        tags << hash_text
      end
      tags.each{|tag| yield tag } if block_given?
      tags
    end

  end
end
