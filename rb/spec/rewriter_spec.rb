# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe Twitter::TwitterText::Rewriter do
  def original_text; end
  def url; end

  def block(*args)
    if Array === @block_args
      unless Array === @block_args.first
        @block_args = [@block_args]
      end
      @block_args << args
    else
      @block_args = args
    end
    "[rewritten]"
  end

  describe "rewrite usernames" do #{{{
    before do
      @rewritten_text = Twitter::TwitterText::Rewriter.rewrite_usernames_or_lists(original_text, &method(:block))
    end

    context "username preceded by a space" do
      def original_text; "hello @jacob"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "hello [rewritten]"
      end
    end

    context "username at beginning of line" do
      def original_text; "@jacob you're cool"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "[rewritten] you're cool"
      end
    end

    context "username preceded by word character" do
      def original_text; "meet@the beach"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "meet@the beach"
      end
    end

    context "username preceded by non-word character" do
      def original_text; "great.@jacob"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "great.[rewritten]"
      end
    end

    context "username containing non-word characters" do
      def original_text; "@jacob&^$%^"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "[rewritten]&^$%^"
      end
    end

    context "username over twenty characters" do
      def original_text
        @twenty_character_username = "zach" * 5
        "@" + @twenty_character_username + "1"
      end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", @twenty_character_username, nil]
        expect(@rewritten_text).to be == "[rewritten]1"
      end
    end

    context "username followed by japanese" do
      def original_text; "@jacobの"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "[rewritten]の"
      end
    end

    context "username preceded by japanese" do
      def original_text; "あ@jacob"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "あ[rewritten]"
      end
    end

    context "username surrounded by japanese" do
      def original_text; "あ@jacobの"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "あ[rewritten]の"
      end
    end

    context "username using full-width at-sign" do
      def original_text
        "#{[0xFF20].pack('U')}jacob"
      end

      it "should be rewritten" do
        expect(@block_args).to be == ["＠", "jacob", nil]
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end
  end #}}}

  describe "rewrite lists" do #{{{
    before do
      @rewritten_text = Twitter::TwitterText::Rewriter.rewrite_usernames_or_lists(original_text, &method(:block))
    end

    context "slug preceded by a space" do
      def original_text; "hello @jacob/my-list"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", "/my-list"]
        expect(@rewritten_text).to be == "hello [rewritten]"
      end
    end

    context "username followed by a slash but no list" do
      def original_text; "hello @jacob/ my-list"; end

      it "should not be rewritten" do
        expect(@block_args).to be == ["@", "jacob", nil]
        expect(@rewritten_text).to be == "hello [rewritten]/ my-list"
      end
    end

    context "empty username followed by a list" do
      def original_text; "hello @/my-list"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "hello @/my-list"
      end
    end

    context "list slug at beginning of line" do
      def original_text; "@jacob/my-list"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", "/my-list"]
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "username preceded by alpha-numeric character" do
      def original_text; "meet@jacob/my-list"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "meet@jacob/my-list"
      end
    end

    context "username preceded by non-word character" do
      def original_text; "great.@jacob/my-list"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", "/my-list"]
        expect(@rewritten_text).to be == "great.[rewritten]"
      end
    end

    context "username containing non-word characters" do
      def original_text; "@jacob/my-list&^$%^"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", "/my-list"]
        expect(@rewritten_text).to be == "[rewritten]&^$%^"
      end
    end

    context "username over twenty characters" do
      def original_text
        @twentyfive_character_list = "a" * 25
        "@jacob/#{@twentyfive_character_list}12345"
      end

      it "should be rewritten" do
        expect(@block_args).to be == ["@", "jacob", "/#{@twentyfive_character_list}"]
        expect(@rewritten_text).to be == "[rewritten]12345"
      end
    end
  end #}}}

  describe "rewrite hashtags" do #{{{
    before do
      @rewritten_text = Twitter::TwitterText::Rewriter.rewrite_hashtags(original_text, &method(:block))
    end

    context "with an all numeric hashtag" do
      def original_text; "#123"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "#123"
      end
    end

    context "with a hashtag with alphanumeric characters" do
      def original_text; "#ab1d"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "ab1d"]
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "with a hashtag with underscores" do
      def original_text; "#a_b_c_d"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "a_b_c_d"]
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "with a hashtag that is preceded by a word character" do
      def original_text; "ab#cd"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "ab#cd"
      end
    end

    context "with a hashtag that starts with a number but has word characters" do
      def original_text; "#2ab"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "2ab"]
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "with multiple valid hashtags" do
      def original_text; "I'm frickin' awesome #ab #cd #ef"; end

      it "rewrites each hashtag" do
        expect(@block_args).to be == [["#", "ab"], ["#", "cd"], ["#", "ef"]]
        expect(@rewritten_text).to be == "I'm frickin' awesome [rewritten] [rewritten] [rewritten]"
      end
    end

    context "with a hashtag preceded by a ." do
      def original_text; "ok, great.#abc"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "abc"]
        expect(@rewritten_text).to be == "ok, great.[rewritten]"
      end
    end

    context "with a hashtag preceded by a &" do
      def original_text; "&#nbsp;"; end

      it "should not be rewritten" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "&#nbsp;"
      end
    end

    context "with a hashtag that ends in an !" do
      def original_text; "#great!"; end

      it "should be rewritten, but should not include the !" do
        expect(@block_args).to be == ["#", "great"];
        expect(@rewritten_text).to be == "[rewritten]!"
      end
    end

    context "with a hashtag followed by Japanese" do
      def original_text; "#twj_devの"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "twj_devの"];
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "with a hashtag preceded by a full-width space" do
      def original_text; "#{[0x3000].pack('U')}#twj_dev"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "twj_dev"];
        expect(@rewritten_text).to be == "　[rewritten]"
      end
    end

    context "with a hashtag followed by a full-width space" do
      def original_text; "#twj_dev#{[0x3000].pack('U')}"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "twj_dev"];
        expect(@rewritten_text).to be == "[rewritten]　"
      end
    end

    context "with a hashtag using full-width hash" do
      def original_text; "#{[0xFF03].pack('U')}twj_dev"; end

      it "should be rewritten" do
        expect(@block_args).to be == ["＃", "twj_dev"];
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end

    context "with a hashtag containing an accented latin character" do
      def original_text
        # the hashtag is #éhashtag
        "##{[0x00e9].pack('U')}hashtag"
      end

      it "should be rewritten" do
        expect(@block_args).to be == ["#", "éhashtag"];
        expect(@rewritten_text).to be == "[rewritten]"
      end
    end
  end #}}}

  describe "rewrite urls" do #{{{
    def url; "http://www.google.com"; end

    before do
      @rewritten_text = Twitter::TwitterText::Rewriter.rewrite_urls(original_text, &method(:block))
    end

    context "when embedded in plain text" do
      def original_text; "On my search engine #{url} I found good links."; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "On my search engine [rewritten] I found good links."
      end
    end

    context "when surrounded by Japanese;" do
      def original_text; "いまなにしてる#{url}いまなにしてる"; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "いまなにしてる[rewritten]いまなにしてる"
      end
    end

    context "with a path surrounded by parentheses;" do
      def original_text; "I found a neatness (#{url})"; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
      end

      context "when the URL ends with a slash;" do
        def url; "http://www.google.com/"; end

        it "should be rewritten" do
          expect(@block_args).to be == [url];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
        end
      end

      context "when the URL has a path;" do
        def url; "http://www.google.com/fsdfasdf"; end

        it "should be rewritten" do
          expect(@block_args).to be == [url];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
        end
      end
    end

    context "when path contains parens" do
      def original_text; "I found a neatness (#{url})"; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
      end

      context "wikipedia" do
        def url; "http://en.wikipedia.org/wiki/Madonna_(artist)"; end

        it "should be rewritten" do
          expect(@block_args).to be == [url];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
        end
      end

      context "IIS session" do
        def url; "http://msdn.com/S(deadbeef)/page.htm"; end

        it "should be rewritten" do
          expect(@block_args).to be == [url];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten])"
        end
      end

      context "unbalanced parens" do
        def url; "http://example.com/i_has_a_("; end

        it "should be rewritten" do
          expect(@block_args).to be == ["http://example.com/i_has_a_"];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten]()"
        end
      end

      context "balanced parens with a double quote inside" do
        def url; "http://foo.bar.com/foo_(\")_bar" end

        it "should be rewritten" do
          expect(@block_args).to be == ["http://foo.bar.com/foo_"];
          expect(@rewritten_text).to be == "I found a neatness ([rewritten](\")_bar)"
        end
      end

      context "balanced parens hiding XSS" do
        def url; 'http://x.xx.com/("style="color:red"onmouseover="alert(1)' end

        it "should be rewritten" do
          expect(@block_args).to be == ["http://x.xx.com/"];
          expect(@rewritten_text).to be == 'I found a neatness ([rewritten]("style="color:red"onmouseover="alert(1))'
        end
      end
    end

    context "when preceded by a :" do
      def original_text; "Check this out @hoverbird:#{url}"; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "Check this out @hoverbird:[rewritten]"
      end
    end

    context "with a URL ending in allowed punctuation" do
      it "does not consume ending punctuation" do
        %w| ? ! , . : ; ] ) } = \ ' |.each do |char|
          expect(Twitter::TwitterText::Rewriter.rewrite_urls("#{url}#{char}") do |url|
            expect(url).to be == url
            "[rewritten]"
          end).to be == "[rewritten]#{char}"
        end
      end
    end

    context "with a URL preceded in forbidden characters" do
      it "should be rewritten" do
        %w| \ ' / ! = |.each do |char|
          expect(Twitter::TwitterText::Rewriter.rewrite_urls("#{char}#{url}") do |url|
            "[rewritten]" # should not be called here.
          end).to be == "#{char}[rewritten]"
        end
      end
    end

    context "when embedded in a link tag" do
      def original_text; "<link rel='true'>#{url}</link>"; end

      it "should be rewritten" do
        expect(@block_args).to be == [url];
        expect(@rewritten_text).to be == "<link rel='true'>[rewritten]</link>"
      end
    end

    context "with multiple URLs" do
      def original_text; "http://www.links.org link at start of page, link at end http://www.foo.org"; end

      it "should autolink each one" do
        expect(@block_args).to be == [["http://www.links.org"], ["http://www.foo.org"]];
        expect(@rewritten_text).to be == "[rewritten] link at start of page, link at end [rewritten]"
      end
    end

    context "with multiple URLs in different formats" do
      def original_text; "http://foo.com https://bar.com http://mail.foobar.org"; end

      it "should autolink each one, in the proper order" do
        expect(@block_args).to be == [["http://foo.com"], ["https://bar.com"], ["http://mail.foobar.org"]];
        expect(@rewritten_text).to be == "[rewritten] [rewritten] [rewritten]"
      end
    end

    context "with a URL having a long TLD" do
      def original_text; "Yahoo integriert Facebook http://golem.mobi/0912/71607.html"; end

      it "should autolink it" do
        expect(@block_args).to be == ["http://golem.mobi/0912/71607.html"]
        expect(@rewritten_text).to be == "Yahoo integriert Facebook [rewritten]"
      end
    end

    context "with a url lacking the protocol" do
      def original_text; "I like www.foobar.com dudes"; end

      it "does not link at all" do
        expect(@block_args).to be nil
        expect(@rewritten_text).to be == "I like www.foobar.com dudes"
      end
    end

    context "with a @ in a URL" do
      context "with XSS attack" do
        def original_text; 'http://x.xx.com/@"style="color:pink"onmouseover=alert(1)//'; end

        it "should not allow XSS follwing @" do
          expect(@block_args).to be == ["http://x.xx.com/"]
          expect(@rewritten_text).to be == '[rewritten]@"style="color:pink"onmouseover=alert(1)//'
        end
      end

      context "with a username not followed by a /" do
        def original_text; "http://example.com/@foobar"; end

        it "should link url" do
          expect(@block_args).to be == ["http://example.com/@foobar"]
          expect(@rewritten_text).to be == "[rewritten]"
        end
      end

      context "with a username followed by a /" do
        def original_text; "http://example.com/@foobar/"; end

        it "should not link the username but link full url" do
          expect(@block_args).to be == ["http://example.com/@foobar/"]
          expect(@rewritten_text).to be == "[rewritten]"
        end
      end
    end
  end #}}}
end

# vim: foldmethod=marker
