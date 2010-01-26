
module Twitter
  # A module for including Tweet auto-linking in a class. The primary use of this is for helpers/views so they can auto-link
  # usernames, lists, hashtags and URLs.
  module Autolink
    include ActionView::Helpers::TagHelper #tag_options needed by auto_link

    # Default CSS class for auto-linked URLs
    DEFAULT_URL_CLASS = "tweet-url"
    # Default CSS class for auto-linked lists (along with the url class)
    DEFAULT_LIST_CLASS = "list-slug"
    # Default CSS class for auto-linked usernames (along with the url class)
    DEFAULT_USERNAME_CLASS = "username"
    # Default CSS class for auto-linked hashtags (along with the url class)
    DEFAULT_HASHTAG_CLASS = "hashtag"

    # Add <tt><a></a></tt> tags around the usernames, lists, hashtags and URLs in the provided <tt>text</tt>. The
    # <tt><a></tt> tags can be controlled with the following entries in the <tt>options</tt>
    # hash:
    #
    # <tt>:url_class</tt>::     class to add to all <tt><a></tt> tags
    # <tt>:list_class</tt>::    class to add to list <tt><a></tt> tags
    # <tt>:username_class</tt>::    class to add to username <tt><a></tt> tags
    # <tt>:hashtag_class</tt>::    class to add to hashtag <tt><a></tt> tags
    # <tt>:username_url_base</tt>::      the value for <tt>href</tt> attribute on username links. The <tt>@username</tt> (minus the <tt>@</tt>) will be appended at the end of this.
    # <tt>:list_url_base</tt>::      the value for <tt>href</tt> attribute on list links. The <tt>@username/list</tt> (minus the <tt>@</tt>) will be appended at the end of this.
    # <tt>:hashtag_url_base</tt>::      the value for <tt>href</tt> attribute on hashtag links. The <tt>#hashtag</tt> (minus the <tt>#</tt>) will be appended at the end of this.
    def auto_link(text, options = {}, &block) # :yields: hashtag_or_list_or_username
      options = options.dup
      auto_link_usernames_or_lists(auto_link_urls_custom(auto_link_hashtags(text), options, &block), &block)
    end

    # Add <tt><a></a></tt> tags around the usernames and lists in the provided <tt>text</tt>. The
    # <tt><a></tt> tags can be controlled with the following entries in the <tt>options</tt>
    # hash:
    #
    # <tt>:url_class</tt>::     class to add to all <tt><a></tt> tags
    # <tt>:list_class</tt>::    class to add to list <tt><a></tt> tags
    # <tt>:username_class</tt>::    class to add to username <tt><a></tt> tags
    # <tt>:username_url_base</tt>::      the value for <tt>href</tt> attribute on username links. The <tt>@username</tt> (minus the <tt>@</tt>) will be appended at the end of this.
    # <tt>:list_url_base</tt>::      the value for <tt>href</tt> attribute on list links. The <tt>@username/list</tt> (minus the <tt>@</tt>) will be appended at the end of this.
    def auto_link_usernames_or_lists(text, options = {}) # :yields: list_or_username
      options = options.dup
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:list_class] ||= DEFAULT_LIST_CLASS
      options[:username_class] ||= DEFAULT_USERNAME_CLASS
      options[:username_url_base] ||= "http://twitter.com/"
      options[:list_url_base] ||= "http://twitter.com/"

      text.gsub(Twitter::Regex[:auto_link_usernames_or_lists]) do
        if $4 && !options[:suppress_lists]
          # the link is a list
          text = list = "#{$3}#{$4}"
          text = yield(list) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:list_class]}\" href=\"#{options[:list_url_base]}#{list.downcase}\">#{text}</a>"
        else
          # this is a screen name
          text = $3
          text = yield(text) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:username_class]}\" href=\"#{options[:username_url_base]}#{$3}\">#{text}</a>"
        end
      end
    end

    # Add <tt><a></a></tt> tags around the hashtags in the provided <tt>text</tt>. The
    # <tt><a></tt> tags can be controlled with the following entries in the <tt>options</tt>
    # hash:
    #
    # <tt>:url_class</tt>::     class to add to all <tt><a></tt> tags
    # <tt>:hashtag_class</tt>:: class to add to hashtag <tt><a></tt> tags
    # <tt>:hashtag_url_base</tt>::      the value for <tt>href</tt> attribute. The hashtag text (minus the <tt>#</tt>) will be appended at the end of this.
    #
    def auto_link_hashtags(text, options = {})  # :yields: hashtag_text
      options = options.dup
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:hashtag_class] ||= DEFAULT_HASHTAG_CLASS
      options[:hashtag_url_base] ||= "http://twitter.com/search?q=%23"

      text.gsub(Twitter::Regex[:auto_link_hashtags]) do
        before = $1
        hash = $2
        text = $3
        text = yield(text) if block_given?
        "#{before}<a href=\"#{options[:hashtag_url_base]}#{text}\" title=\"##{text}\" class=\"#{options[:url_class]} #{options[:hashtag_class]}\">#{hash}#{text}</a>"
      end
    end

    # Add <tt><a></a></tt> tags around the URLs in the provided <tt>text</tt>. Any
    # elements in the <tt>href_options</tt> hash will be converted to HTML attributes
    # and place in the <tt><a></tt> tag.
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