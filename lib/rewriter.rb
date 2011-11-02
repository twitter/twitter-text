module Twitter
  # A module provides base methods to rewrite usernames, lists, hashtags and URLs.
  module Rewriter extend self
    def rewrite(text, options = {})
      [:hashtags, :urls, :usernames_or_lists].inject(text) do |key|
        send("rewrite_#{key}", text, &options[key]) if options[key]
      end
    end

    def rewrite_usernames_or_lists(text)
      new_text = ""

      # this -1 flag allows strings ending in ">" to work
      text.to_s.split(/[<>]/, -1).each_with_index do |chunk, index|
        if index != 0
          new_text << ((index % 2 == 0) ? ">" : "<")
        end

        if index % 4 != 0
          new_text << chunk
        else
          new_text << chunk.gsub(Twitter::Regex[:auto_link_usernames_or_lists]) do
            before, at, user, slash_listname, after = $1, $2, $3, $4, $'
            if slash_listname
              # the link is a list
              "#{before}#{yield(at, user, slash_listname)}"
            else
              if after =~ Twitter::Regex[:end_screen_name_match]
                # Followed by something that means we don't autolink
                "#{before}#{at}#{user}#{slash_listname}"
              else
                # this is a screen name
                "#{before}#{yield(at, user, nil)}#{slash_listname}"
              end
            end
          end
        end
      end

      new_text
    end

    def rewrite_hashtags(text)
      text.to_s.gsub(Twitter::Regex[:auto_link_hashtags]) do
        before, hash, hashtag, after = $1, $2, $3, $'
        if after =~ Twitter::Regex[:end_hashtag_match]
          "#{before}#{hash}#{hashtag}"
        else
          "#{before}#{yield(hash, hashtag)}"
        end
      end
    end

    def rewrite_urls(text)
      text.to_s.gsub(Twitter::Regex[:valid_url]) do
        all, before, url, protocol, domain, path, query_string = $1, $2, $3, $4, $5, $6, $7
        if protocol && !protocol.empty?
          "#{before}#{yield(url)}"
        else
          all
        end
      end
    end
  end
end
