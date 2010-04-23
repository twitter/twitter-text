
module Twitter
  # A module for including Tweet auto-linking in a class. The primary use of this is for helpers/views so they can auto-link
  # usernames, lists, hashtags and URLs.
  module Autolink
    include ActionView::Helpers::TagHelper #tag_options needed by auto_link

    WWW_REGEX = /www\./i #:nodoc:

    # Default CSS class for auto-linked URLs
    DEFAULT_URL_CLASS = "tweet-url"
    # Default CSS class for auto-linked lists (along with the url class)
    DEFAULT_LIST_CLASS = "list-slug"
    # Default CSS class for auto-linked usernames (along with the url class)
    DEFAULT_USERNAME_CLASS = "username"
    # Default CSS class for auto-linked hashtags (along with the url class)
    DEFAULT_HASHTAG_CLASS = "hashtag"
    # HTML attribute for robot nofollow behavior (default)
    HTML_ATTR_NO_FOLLOW = " rel=\"nofollow\""
    # Default Tag used for hit highlighting
    DEFAULT_HIGHLIGHT_TAG = "b"

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
    # <tt>:suppress_lists</tt>::    disable auto-linking to lists
    # <tt>:suppress_no_follow</tt>::   Do not add <tt>rel="nofollow"</tt> to auto-linked items
    def auto_link(text, options = {})
      auto_link_usernames_or_lists(
        auto_link_urls_custom(
          auto_link_hashtags(text, options),
        options),
      options)
    end
    
    def auto_link_with_hits(text, options = {}, hits = [])
      hit_highlight(
        auto_link(text, options),
      hits)
    end
    
    def hit_highlight(text, hits = [])
      if hits.empty?
        return text
      end
      
      # Break up into pairs of (meta, source)
      chunks = text.split("<").map do |item|
        item.split(">")
      end.flatten
      
      tags = ["<" + DEFAULT_HIGHLIGHT_TAG + ">", "</" + DEFAULT_HIGHLIGHT_TAG + ">"]
      
      result = ""
      chunk_index, chunk = 0, chunks[0]
      prev_chunks_len = 0
      chunk_cursor = 0
      for hit, index in hits.flatten.each_with_index do
        tag = tags[index % 2]
        
        until hit < prev_chunks_len + chunk.length do
          result << chunk[chunk_cursor..-1] + "<#{chunks[chunk_index+1]}>"
          prev_chunks_len += chunk.length
          chunk_cursor = 0
          chunk_index += 2
          chunk = chunks[chunk_index]
        end
        hit_spot = hit - prev_chunks_len
        result << chunk[chunk_cursor...hit_spot] + tag
        chunk_cursor = hit_spot
      end
      
      result << chunk[chunk_cursor..-1]
      for index in chunk_index+1..chunks.length-1
        result << (index.even? ? chunks[index] : "<#{chunks[index]}>")
      end
      
      result
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
    # <tt>:suppress_lists</tt>::    disable auto-linking to lists
    # <tt>:suppress_no_follow</tt>::   Do not add <tt>rel="nofollow"</tt> to auto-linked items
    def auto_link_usernames_or_lists(text, options = {}) # :yields: list_or_username
      options = options.dup
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:list_class] ||= DEFAULT_LIST_CLASS
      options[:username_class] ||= DEFAULT_USERNAME_CLASS
      options[:username_url_base] ||= "http://twitter.com/"
      options[:list_url_base] ||= "http://twitter.com/"
      extra_html = HTML_ATTR_NO_FOLLOW unless options[:suppress_no_follow]

      text.gsub(Twitter::Regex[:auto_link_usernames_or_lists]) do
        if $4 && !options[:suppress_lists]
          # the link is a list
          text = list = "#{$3}#{$4}"
          text = yield(list) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:list_class]}\" href=\"#{options[:list_url_base]}#{list.downcase}\"#{extra_html}>#{text}</a>"
        else
          # this is a screen name
          text = $3
          text = yield(text) if block_given?
          "#{$1}#{$2}<a class=\"#{options[:url_class]} #{options[:username_class]}\" href=\"#{options[:username_url_base]}#{text}\"#{extra_html}>#{text}</a>"
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
    # <tt>:suppress_no_follow</tt>::   Do not add <tt>rel="nofollow"</tt> to auto-linked items
    def auto_link_hashtags(text, options = {})  # :yields: hashtag_text
      options = options.dup
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:hashtag_class] ||= DEFAULT_HASHTAG_CLASS
      options[:hashtag_url_base] ||= "http://twitter.com/search?q=%23"
      extra_html = HTML_ATTR_NO_FOLLOW unless options[:suppress_no_follow]

      text.gsub(Twitter::Regex[:auto_link_hashtags]) do
        before = $1
        hash = $2
        text = $3
        text = yield(text) if block_given?
        "#{before}<a href=\"#{options[:hashtag_url_base]}#{text}\" title=\"##{text}\" class=\"#{options[:url_class]} #{options[:hashtag_class]}\"#{extra_html}>#{hash}#{text}</a>"
      end
    end

    # Add <tt><a></a></tt> tags around the URLs in the provided <tt>text</tt>. Any
    # elements in the <tt>href_options</tt> hash will be converted to HTML attributes
    # and place in the <tt><a></tt> tag. Unless <tt>href_options</tt> contains <tt>:suppress_no_follow</tt>
    # the <tt>rel="nofollow"</tt> attribute will be added.
    def auto_link_urls_custom(text, href_options = {})
      options = href_options.dup
      options[:rel] = "nofollow" unless options.delete(:suppress_no_follow)

      text.gsub(Twitter::Regex[:valid_url]) do
        all, before, url, protocol = $1, $2, $3, $4
        html_attrs = tag_options(options.stringify_keys) || ""
        full_url = (protocol =~ WWW_REGEX ? "http://#{url}" : url)
        "#{before}<a href=\"#{full_url}\"#{html_attrs}>#{url}</a>"
      end
    end

  end
end