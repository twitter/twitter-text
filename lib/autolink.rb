require 'set'

module Twitter
  # A module for including Tweet auto-linking in a class. The primary use of this is for helpers/views so they can auto-link
  # usernames, lists, hashtags and URLs.
  module Autolink extend self
    # Default CSS class for auto-linked URLs
    DEFAULT_URL_CLASS = "tweet-url"
    # Default CSS class for auto-linked lists (along with the url class)
    DEFAULT_LIST_CLASS = "list-slug"
    # Default CSS class for auto-linked usernames (along with the url class)
    DEFAULT_USERNAME_CLASS = "username"
    # Default CSS class for auto-linked hashtags (along with the url class)
    DEFAULT_HASHTAG_CLASS = "hashtag"
    # Default target for auto-linked urls (nil will not add a target attribute)
    DEFAULT_TARGET = nil
    # HTML attribute for robot nofollow behavior (default)
    HTML_ATTR_NO_FOLLOW = " rel=\"nofollow\""
    # Options which should not be passed as HTML attributes
    OPTIONS_NOT_ATTRIBUTES = [:url_class, :list_class, :username_class, :hashtag_class,
                              :username_url_base, :list_url_base, :hashtag_url_base,
                              :username_url_block, :list_url_block, :hashtag_url_block, :link_url_block,
                              :suppress_lists, :suppress_no_follow, :url_entities]

    HTML_ENTITIES = {
      '&' => '&amp;',
      '>' => '&gt;',
      '<' => '&lt;',
      '"' => '&quot;',
      "'" => '&#39;'
    }

    def html_escape(text)
      text && text.to_s.gsub(/[&"'><]/) do |character|
        HTML_ENTITIES[character]
      end
    end

    def auto_link_entities(text, entities, options)
      return text if entities.empty?
      
      options = options.dup
      options[:class] = options[:url_class]
      options[:rel] = "nofollow" unless options[:suppress_no_follow]
      options[:url_class] ||= DEFAULT_URL_CLASS
      options[:list_class] ||= DEFAULT_LIST_CLASS
      options[:username_class] ||= DEFAULT_USERNAME_CLASS
      options[:username_url_base] ||= "http://twitter.com/"
      options[:list_url_base] ||= "http://twitter.com/"
      options[:hashtag_class] ||= DEFAULT_HASHTAG_CLASS
      options[:hashtag_url_base] ||= "http://twitter.com/#!/search?q=%23"
      options[:target] ||= DEFAULT_TARGET
      extra_html = HTML_ATTR_NO_FOLLOW unless options[:suppress_no_follow]
      
      url_entities = {}
      if options[:url_entities]
        options[:url_entities].each do |entity|
          entity = entity.with_indifferent_access
          url_entities[entity[:url]] = entity
        end
        options.delete(:url_entities)
      end
      
      html_attrs = nil
      Twitter::Rewriter.rewrite_entities(text, entities) do |entity, chars|
        if entity[:url]
          url = entity[:url]
          href = if options[:link_url_block]
            options.delete(:link_url_block).call(url)
          else
            html_escape(url)
          end
  
          display_url = url
          if url_entities[url] && url_entities[url][:display_url]
            display_url = url_entities[url][:display_url]
          end
  
          html_attrs = html_attrs_for_options(options) unless html_attrs
          %(<a href="#{href}"#{html_attrs}>#{html_escape(display_url)}</a>)
        elsif entity[:hashtag]
          hashtag = entity[:hashtag]
          hash = chars[entity[:indices].first]
          yield(hashtag) if block_given?
          href = if options[:hashtag_url_block]
            options[:hashtag_url_block].call(hashtag)
          else
            "#{options[:hashtag_url_base]}#{html_escape(hashtag)}"
          end
          %(<a href="#{href}" title="##{html_escape(hashtag)}" #{target_tag(options)}class="#{options[:url_class]} #{options[:hashtag_class]}"#{extra_html}>#{hash}#{html_escape(hashtag)}</a>)
        elsif entity[:screen_name]
          name = "#{entity[:screen_name]}#{entity[:list_slug]}"
          chunk = block_given? ? yield(name) : name
          at = chars[entity[:indices].first]
  
          if !entity[:list_slug].empty? && !options[:suppress_lists]
            href = if options[:list_url_block]
              options[:list_url_block].call(name.downcase)
            else
              "#{html_escape(options[:list_url_base])}#{html_escape(name.downcase)}"
            end
            %(#{at}<a class="#{options[:url_class]} #{options[:list_class]}" #{target_tag(options)}href="#{href}"#{extra_html}>#{html_escape(chunk)}</a>)
          else
            href = if options[:username_url_block]
              options[:username_url_block].call(chunk)
            else
              "#{html_escape(options[:username_url_base])}#{html_escape(chunk)}"
            end
            %(#{at}<a class="#{options[:url_class]} #{options[:username_class]}" #{target_tag(options)}href="#{href}"#{extra_html}>#{html_escape(chunk)}</a>)
          end
        end
      end
    end

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
    # <tt>:target</tt>::   add <tt>target="window_name"</tt> to auto-linked items
    def auto_link(text, options = {})
      auto_link_entities(text, Extractor.extract_entities_with_indices(text, {:extract_url_without_protocol => false}), options)
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
    # <tt>:target</tt>::   add <tt>target="window_name"</tt> to auto-linked items
    def auto_link_usernames_or_lists(text, options = {}) # :yields: list_or_username
      if block_given?
        auto_link_entities(text, Extractor.extract_mentions_or_lists_with_indices(text), options) do |name|
          yield(name)
        end
      else
        auto_link_entities(text, Extractor.extract_mentions_or_lists_with_indices(text), options)
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
    # <tt>:target</tt>::   add <tt>target="window_name"</tt> to auto-linked items
    def auto_link_hashtags(text, options = {})  # :yields: hashtag_text
      if block_given?
        auto_link_entities(text, Extractor.extract_hashtags_with_indices(text), options) do |hashtag|
          yield(hashtag)
        end
      else
        auto_link_entities(text, Extractor.extract_hashtags_with_indices(text), options)
      end
    end

    # Add <tt><a></a></tt> tags around the URLs in the provided <tt>text</tt>. Any
    # elements in the <tt>href_options</tt> hash will be converted to HTML attributes
    # and place in the <tt><a></tt> tag. Unless <tt>href_options</tt> contains <tt>:suppress_no_follow</tt>
    # the <tt>rel="nofollow"</tt> attribute will be added.
    def auto_link_urls_custom(text, href_options = {})
      auto_link_entities(text, Extractor.extract_urls_with_indices(text, {:extract_url_without_protocol => false}), href_options)
    end

    private

    BOOLEAN_ATTRIBUTES = Set.new([:disabled, :readonly, :multiple, :checked]).freeze

    def html_attrs_for_options(options)
      html_attrs options.reject{|k, v| OPTIONS_NOT_ATTRIBUTES.include?(k)}
    end

    def html_attrs(options)
      options.inject("") do |attrs, (key, value)|
        if BOOLEAN_ATTRIBUTES.include?(key)
          value = value ? key : nil
        end
        if !value.nil?
          attrs << %( #{html_escape(key)}="#{html_escape(value)}")
        end
        attrs
      end
    end

    def target_tag(options)
      target_option = options[:target].to_s
      if target_option.empty?
        ""
      else
        "target=\"#{html_escape(target_option)}\""
      end
    end
  end
end
