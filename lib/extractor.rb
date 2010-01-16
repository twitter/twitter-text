
module Twitter
  class Extractor

    def extract_mentioned_screen_names(text)
      return unless text

      possible_screen_names = text.scan(Twitter::Regex[:extract_mentions]).map{|before,sn| sn }
      possible_screen_names.each{|sn| yield sn } if block_given?
      possible_screen_names
    end

    def extract_reply_screen_name(text)
      return unless text

      possible_screen_name = text.match(Twitter::Regex[:extract_reply])
      return unless possible_screen_name.respond_to?(:captures)
      screen_name = possible_screen_name.captures.first
      yield screen_name if block_given?
      screen_name
    end

    def extract_urls(text)
      return unless text

      urls = text.to_s.scan(Twitter::Regex[:valid_url]).each.map do |all, before, url, protocol, domain, path, query|
        (protocol == "www." ? "http://#{url}" : url)
      end
      urls.each{|url| yield url } if block_given?
      urls
    end

    def extract_hashtags(text)
      return unless text

      tags = text.scan(Twitter::Regex[:auto_link_hashtags]).map do |before, hash, hash_text|
        hash_text
      end
      tags.each{|url| yield url } if block_given?
      tags
    end

  end
end