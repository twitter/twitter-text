module Twitter
  # A module provides base methods to rewrite usernames, lists, hashtags and URLs.
  module Rewriter extend self
    def rewrite_entities(text, entities)
      begin_index = 0
      result = ""
      chars = text.to_s.chars.to_a

      entities.each do |entity|
        result << chars[begin_index...entity[:indices].first].to_s
        result << yield(entity, chars)
        begin_index = entity[:indices].last
      end
      result << chars[begin_index..-1].to_s

      result
    end

    # These methods are deprecated, will be removed in future.
    extend Deprecation

    def rewrite(text, options = {})
      [:hashtags, :urls, :usernames_or_lists].inject(text) do |key|
        send("rewrite_#{key}", text, &options[key]) if options[key]
      end
    end
    deprecate :rewrite, :rewrite_entities

    def rewrite_usernames_or_lists(text)
      rewrite_entities(text, Extractor.extract_mentions_or_lists_with_indices(text)) do |entity, chars|
        at = chars[entity[:indices].first]
        list_slug = entity[:list_slug]
        list_slug = nil if list_slug.empty?
        yield(at, entity[:screen_name], list_slug) if block_given?
      end
    end
    deprecate :rewrite_usernames_or_lists, :rewrite_entties

    def rewrite_hashtags(text)
      rewrite_entities(text, Extractor.extract_hashtags_with_indices(text)) do |entity, chars|
        hash = chars[entity[:indices].first]
        yield(hash, entity[:hashtag]) if block_given?
      end
    end
    deprecate :rewrite_hashtags, :rewrite_entties

    def rewrite_urls(text)
      urls = Extractor.extract_urls_with_indices(text, {:extract_url_without_protocol=>false})
      rewrite_entities(text, urls) do |entity, chars|
        yield(entity[:url]) if block_given?
      end
    end
    deprecate :rewrite_urls, :rewrite_entties
  end
end
