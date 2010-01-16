
module Twitter
  class Autolink
    include ActionView::Helpers::TagHelper #tag_options needed by auto_link

    DEFAULT_URL_CLASS = "tweet-url"
    DEFAULT_LIST_CLASS = "list-slug"
    DEFAULT_USERNAME_CLASS = "username"
    DEFAULT_HASHTAG_CLASS = "hashtag"

    def auto_link(text, options = {}, &block)
      auto_link_usernames_or_lists(auto_link_urls_custom(auto_link_hashtags(text), options, &block), &block)
    end

    def auto_link_usernames_or_lists(text, options = {})
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:list_class] ||= DEFAULT_LIST_CLASS
      options[:username_class] ||= DEFAULT_USERNAME_CLASS
      options[:url_base] ||= "/"

      text.gsub(Twitter::Regex[:auto_link_usernames_or_lists]) do
        if $4 && !options[:suppress_lists]
          # the link is a list
          text = list = "#{$3}#{$4}"
          text = yield(list) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:list_class]}\" href=\"/#{list.downcase}\">#{text}</a>"
        else
          # this is a screen name
          text = $3
          text = yield(text) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:username_class]}\" href=\"/#{$3}\">#{text}</a>"
        end
      end
    end

    def auto_link_hashtags(text, options = {})
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:hashtag_class] ||= DEFAULT_HASHTAG_CLASS
      options[:url_base] ||= "/search?q=%23"

      text.gsub(Twitter::Regex[:auto_link_hashtags]) do
        before = $1
        hash = $2
        text = $3
        text = yield(text) if block_given?
        "#{before}<a href=\"#{options[:url_base]}#{text}\" title=\"##{text}\" class=\"#{options[:url_class]} #{options[:hashtag_class]}\">#{hash}#{text}</a>"
      end
    end

    def auto_link_urls_custom(text, href_options = {})
      text.gsub(Twitter::Regex[:valid_url]) do
        all, before, url, protocol = $1, $2, $3, $4
        options = tag_options(href_options.stringify_keys) || ""
        full_url = (protocol == "www." ? "http://#{url}" : url)
        "#{before}<a href=\"#{full_url}\"#{options}>#{url}</a>"
      end
    end

  end
end