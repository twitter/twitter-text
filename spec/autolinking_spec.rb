#encoding: UTF-8
# require File.dirname(__FILE__) + '/spec_helper'
require 'spec_helper'

class TestAutolink
  include Twitter::Autolink
end

describe Twitter::Autolink do
  def original_text; end
  def url; end

  describe "auto_link_custom" do
    before do
      @autolinked_text = TestAutolink.new.auto_link(original_text) if original_text
    end

    describe "username autolinking" do
      context "username preceded by a space" do
        def original_text; "hello @jacob"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end

      context "username at beginning of line" do
        def original_text; "@jacob you're cool"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end

      context "username preceded by word character" do
        def original_text; "meet@the beach"; end

        it "should not be linked" do
          Hpricot(@autolinked_text).search('a').should be_blank
        end
      end

      context "username preceded by non-word character" do
        def original_text; "great.@jacob"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end

      context "username containing non-word characters" do
        def original_text; "@zach&^$%^"; end

        it "should not be linked" do
          @autolinked_text.should link_to_screen_name('zach')
        end
      end

      context "username over twenty characters" do
        def original_text
          @twenty_character_username = "zach" * 5
          "@" + @twenty_character_username + "1"
        end

        it "should not be linked" do
          @autolinked_text.should link_to_screen_name(@twenty_character_username)
        end
      end

      context "username followed by japanese" do
        def original_text; "@jacobの"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end

      context "username preceded by japanese" do
        def original_text; "あ@matz"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('matz')
        end
      end

      context "username surrounded by japanese" do
        def original_text; "あ@yoshimiの"; end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('yoshimi')
        end
      end

      context "username using full-width at-sign" do
        def original_text
          "#{[0xFF20].pack('U')}jacob"
        end

        it "should be linked" do
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end
    end

    describe "list path autolinking" do

      context "when List is not available" do
        it "should not be linked" do
          @autolinked_text = TestAutolink.new.auto_link_usernames_or_lists("hello @jacob/my-list", :suppress_lists => true)
          @autolinked_text.should_not link_to_list_path('jacob/my-list')
        end
      end

      context "slug preceded by a space" do
        def original_text; "hello @jacob/my-list"; end

        it "should be linked" do
          @autolinked_text.should link_to_list_path('jacob/my-list')
        end
      end

      context "username followed by a slash but no list" do
        def original_text; "hello @jacob/ my-list"; end

        it "should NOT be linked" do
          @autolinked_text.should_not link_to_list_path('jacob/my-list')
          @autolinked_text.should link_to_screen_name('jacob')
        end
      end

      context "empty username followed by a list" do
        def original_text; "hello @/my-list"; end

        it "should NOT be linked" do
          Hpricot(@autolinked_text).search('a').should be_blank
        end
      end

      context "list slug at beginning of line" do
        def original_text; "@jacob/my-list"; end

        it "should be linked" do
          @autolinked_text.should link_to_list_path('jacob/my-list')
        end
      end

      context "username preceded by alpha-numeric character" do
        def original_text; "meet@the/beach"; end

        it "should not be linked" do
          Hpricot(@autolinked_text).search('a').should be_blank
        end
      end

      context "username preceded by non-word character" do
        def original_text; "great.@jacob/my-list"; end

        it "should be linked" do
          @autolinked_text = TestAutolink.new.auto_link("great.@jacob/my-list")
          @autolinked_text.should link_to_list_path('jacob/my-list')
        end
      end

      context "username containing non-word characters" do
        def original_text; "@zach/test&^$%^"; end

        it "should be linked" do
          @autolinked_text.should link_to_list_path('zach/test')
        end
      end

      context "username over twenty characters" do
        def original_text
          @twentyfive_character_list = "jack/" + ("a" * 25)
          "@#{@twentyfive_character_list}12345"
        end

        it "should be linked" do
          @autolinked_text.should link_to_list_path(@twentyfive_character_list)
        end
      end
    end

    describe "hashtag autolinking" do
      context "with an all numeric hashtag" do
        def original_text; "#123"; end

        it "should not be linked" do
          @autolinked_text.should_not have_autolinked_hashtag('#123')
        end
      end

      context "with a hashtag with alphanumeric characters" do
        def original_text; "#ab1d"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#ab1d')
        end
      end

      context "with a hashtag with underscores" do
        def original_text; "#a_b_c_d"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag(original_text)
        end
      end

      context "with a hashtag that is preceded by a word character" do
        def original_text; "ab#cd"; end

        it "should not be linked" do
          @autolinked_text.should_not have_autolinked_hashtag(original_text)
        end
      end

      context "with a page anchor in a url" do
        def original_text; "Here's my url: http://foobar.com/#home"; end

        it "should not link the hashtag" do
          @autolinked_text.should_not have_autolinked_hashtag('#home')
        end

        it "should link the url" do
          @autolinked_text.should have_autolinked_url('http://foobar.com/#home')
        end
      end

      context "with a hashtag that starts with a number but has word characters" do
        def original_text; "#2ab"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag(original_text)
        end
      end

      context "with multiple valid hashtags" do
        def original_text; "I'm frickin' awesome #ab #cd #ef"; end

        it "links each hashtag" do
          @autolinked_text.should have_autolinked_hashtag('#ab')
          @autolinked_text.should have_autolinked_hashtag('#cd')
          @autolinked_text.should have_autolinked_hashtag('#ef')
        end
      end

      context "with a hashtag preceded by a ." do
        def original_text; "ok, great.#abc"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#abc')
        end
      end

      context "with a hashtag preceded by a &" do
        def original_text; "&#nbsp;"; end

        it "should not be linked" do
          @autolinked_text.should_not have_autolinked_hashtag('#nbsp;')
        end
      end

      context "with a hashtag that ends in an !" do
        def original_text; "#great!"; end

        it "should be linked, but should not include the !" do
          @autolinked_text.should have_autolinked_hashtag('#great')
        end
      end

      context "with a hashtag preceded by Japanese" do
        def original_text; "の#twj_dev"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#twj_dev')
        end
      end

      context "with a hashtag followed by Japanese" do
         def original_text; "#twj_devの"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#twj_dev')
        end
      end

      context "with a hashtag preceded by a full-width space" do
        def original_text; "#{[0x3000].pack('U')}#twj_dev"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#twj_dev')
        end
      end

      context "with a hashtag followed by a full-width space" do
        def original_text; "#twj_dev#{[0x3000].pack('U')}"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_hashtag('#twj_dev')
        end
      end

      context "with a hashtag using full-width hash" do
        def original_text; "#{[0xFF03].pack('U')}twj_dev"; end

        it "should be linked" do
          link = Hpricot(@autolinked_text).at('a')
          (link.inner_text.respond_to?(:force_encoding) ? link.inner_text.force_encoding("utf-8") : link.inner_text).should == "#{[0xFF03].pack('U')}twj_dev"
          link['href'].should == 'http://twitter.com/search?q=%23twj_dev'
        end
      end

    end

    describe "URL autolinking" do
      def url; "http://www.google.com"; end

      context "when embedded in plain text" do
        def original_text; "On my search engine #{url} I found good links."; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end
      end

      context "when surrounded by Japanese;" do
        def original_text; "いまなにしてる#{url}いまなにしてる"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end
      end

      context "with a path surrounded by parentheses;" do
        def original_text; "I found a neatness (#{url})"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end

        context "when the URL ends with a slash;" do
          def url; "http://www.google.com/"; end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url(url)
          end
        end

        context "when the URL has a path;" do
          def url; "http://www.google.com/fsdfasdf"; end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url(url)
          end
        end
      end

      context "when path contains parens" do
        def original_text; "I found a neatness (#{url})"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end

        context "wikipedia" do
          def url; "http://en.wikipedia.org/wiki/Madonna_(artist)"; end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url(url)
          end
        end

        context "IIS session" do
          def url; "http://msdn.com/S(deadbeef)/page.htm"; end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url(url)
          end
        end

        context "unbalanced parens" do
          def url; "http://example.com/i_has_a_("; end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url("http://example.com/i_has_a_")
          end
        end

        context "balanced parens with a double quote inside" do
          def url; "http://foo.bar/foo_(\")_bar" end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url("http://foo.bar/foo_")
          end
        end

        context "balanced parens hiding XSS" do
          def url; 'http://x.xx/("style="color:red"onmouseover="alert(1)' end

          it "should be linked" do
            @autolinked_text.should have_autolinked_url("http://x.xx/")
          end
        end
      end

      context "when preceded by a :" do
        def original_text; "Check this out @hoverbird:#{url}"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end
      end

      context "with a URL ending in allowed punctuation" do
        it "does not consume ending punctuation" do
          matcher = TestAutolink.new
          %w| ? ! , . : ; ] ) } = \ ' |.each do |char|
            matcher.auto_link("#{url}#{char}").should have_autolinked_url(url)
          end
        end
      end

      context "with a URL preceded in forbidden characters" do
        it "should not be linked" do
          matcher = TestAutolink.new
          %w| \ ' / ! = |.each do |char|
            matcher.auto_link("#{char}#{url}").should_not have_autolinked_url(url)
          end
        end
      end

      context "when embedded in a link tag" do
        def original_text; "<link rel='true'>#{url}</link>"; end

        it "should be linked" do
          @autolinked_text.should have_autolinked_url(url)
        end
      end

      context "with multiple URLs" do
        def original_text; "http://www.links.org link at start of page, link at end http://www.foo.org"; end

        it "should autolink each one" do
          @autolinked_text.should have_autolinked_url('http://www.links.org')
          @autolinked_text.should have_autolinked_url('http://www.foo.org')
        end
      end

      context "with multiple URLs in different formats" do
        def original_text; "http://foo.com https://bar.com http://mail.foobar.org"; end

        it "should autolink each one, in the proper order" do
          @autolinked_text.should have_autolinked_url('http://foo.com')
          @autolinked_text.should have_autolinked_url('https://bar.com')
          @autolinked_text.should have_autolinked_url('http://mail.foobar.org')
        end
      end

      context "with a URL having a long TLD" do
        def original_text; "Yahoo integriert Facebook http://golem.mobi/0912/71607.html"; end

        it "should autolink it" do
          @autolinked_text.should have_autolinked_url('http://golem.mobi/0912/71607.html')
        end
      end

      context "with a url lacking the protocol" do
        def original_text; "I like www.foobar.com dudes"; end

        it "links to the original text with the full href" do
          link = Hpricot(@autolinked_text).at('a')
          link.inner_text.should == 'www.foobar.com'
          link['href'].should == 'http://www.foobar.com'
        end
      end

      context "with a @ in a URL" do
        def original_text; 'http://x.xx/@"style="color:pink"onmouseover=alert(1)//'; end

        it "should not allow XSS follwing @" do
          @autolinked_text.should have_autolinked_url('http://x.xx/')
        end
      end

    end

    describe "Autolink all" do
      before do
        @linker = TestAutolink.new
      end

      it "should allow url/hashtag overlap" do
        auto_linked = @linker.auto_link("http://twitter.com/#search")
        auto_linked.should have_autolinked_url('http://twitter.com/#search')
      end

    end

  end

end
