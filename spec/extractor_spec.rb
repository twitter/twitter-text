require File.dirname(__FILE__) + '/spec_helper'

class TestExtractor
  include Twitter::Extractor
end

describe Twitter::Extractor do
  before do
    @extractor = TestExtractor.new
  end

  describe "mentions" do
    context "single screen name alone " do
      it "should be linked" do
        @extractor.extract_mentioned_screen_names("@alice").should == ["alice"]
      end

      it "should be linked with _" do
        @extractor.extract_mentioned_screen_names("@alice_adams").should == ["alice_adams"]
      end

      it "should be linked if numeric" do
        @extractor.extract_mentioned_screen_names("@1234").should == ["1234"]
      end
    end

    context "multiple screen names" do
      it "should both be linked" do
        @extractor.extract_mentioned_screen_names("@alice @bob").should == ["alice", "bob"]
      end
    end

    context "screen names embedded in text" do
      it "should be linked in Latin text" do
        @extractor.extract_mentioned_screen_names("waiting for @alice to arrive").should == ["alice"]
      end

      it "should be linked in Japanese text" do
        @extractor.extract_mentioned_screen_names("の@aliceに到着を待っている").should == ["alice"]
      end
    end

    it "should accept a block arugment and call it in order" do
      needed = ["alice", "bob"]
      @extractor.extract_mentioned_screen_names("@alice @bob") do |sn|
        sn.should == needed.shift
      end
      needed.should == []
    end
  end

  describe "replies" do
    context "should be extracted from" do
      it "should extract from lone name" do
        @extractor.extract_reply_screen_name("@alice").should == "alice"
      end

      it "should extract from the start" do
        @extractor.extract_reply_screen_name("@alice reply text").should == "alice"
      end

      it "should extract preceeded by a space" do
        @extractor.extract_reply_screen_name(" @alice reply text").should == "alice"
      end

      it "should extract preceeded by a full-width space" do
        @extractor.extract_reply_screen_name("#{[0x3000].pack('U')}@alice reply text").should == "alice"
      end
    end

    context "should not be extracted from" do
      it "should not be extracted when preceeded by text" do
        @extractor.extract_reply_screen_name("reply @alice text").should == nil
      end

      it "should not be extracted when preceeded by puctuation" do
        %w(. / _ - + # ! @).each do |punct|
          @extractor.extract_reply_screen_name("#{punct}@alice text").should == nil
        end
      end
    end

    context "should accept a block arugment" do
      it "should call the block on match" do
        @extractor.extract_reply_screen_name("@alice") do |sn|
          sn.should == "alice"
        end
      end

      it "should not call the block on no match" do
        calls = 0
        @extractor.extract_reply_screen_name("not a reply") do |sn|
          calls += 1
        end
        calls.should == 0
      end
    end
  end

  describe "urls" do
    describe "matching URLS" do
      @urls = [
        "http://google.com",
        "http://foobar.com/#",
        "http://google.com/#foo",
        "http://google.com/#search?q=iphone%20-filter%3Alinks",
        "http://twitter.com/#search?q=iphone%20-filter%3Alinks",
        "http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html",
        "http://somehost.com:3000",
        "http://x.com/~matthew+%-x",
        "http://en.wikipedia.org/wiki/Primer_(film)",
        "http://www.ams.org/bookstore-getitem/item=mbk-59",
        "http://chilp.it/?77e8fd",
      ]

      @urls.each do |url|
        it "should extract the URL #{url}" do
          @extractor.extract_urls(url).should == [url]
        end

        it "should match the URL #{url} when it's embedded in other text" do
          text = "Sweet url: #{url} I found. #awesome"
          @extractor.extract_urls(text).should == [url]
        end
      end
    end

    describe "invalid URLS" do
     it "does not link urls with invalid_domains" do
        [ "http://doman-dash_2314352345_dfasd.foo-cow_4352.com",
          "http://no-tld",
          "http://tld-too-short.x",
          "http://doman-dash_2314352345_dfasd.foo-cow_4352.com",
        ].each {|url| @extractor.extract_urls(url).should == [] }
      end
    end
  end

  describe "hashtags" do
    context "extracts latin/numeric hashtags" do
      %w(text text123 123text).each do |hashtag|
        it "should extract ##{hashtag}" do
          @extractor.extract_hashtags("##{hashtag}").should == [hashtag]
        end

        it "should extract ##{hashtag} within text" do
          @extractor.extract_hashtags("pre-text ##{hashtag} post-text").should == [hashtag]
        end
      end
    end

    context "international hashtags" do

      context "should allow accents" do
        %w(mañana café münchen).each do |hashtag|
          it "should extract ##{hashtag}" do
            @extractor.extract_hashtags("##{hashtag}").should == [hashtag]
          end

          it "should extract ##{hashtag} within text" do
            @extractor.extract_hashtags("pre-text ##{hashtag} post-text").should == [hashtag]
          end
        end

        it "should not allow the multiplication character" do
          @extractor.extract_hashtags("#pre#{[0xd7].pack('U')}post").should == ["pre"]
        end

        it "should not allow the division character" do
          @extractor.extract_hashtags("#pre#{[0xf7].pack('U')}post").should == ["pre"]
        end
      end

      context "should NOT allow Japanese" do
        %w(会議中 ハッシュ).each do |hashtag|
          it "should NOT extract ##{hashtag}" do
            @extractor.extract_hashtags("##{hashtag}").should == []
          end

          it "should NOT extract ##{hashtag} within text" do
            @extractor.extract_hashtags("pre-text ##{hashtag} post-text").should == []
          end
        end
      end

    end

    it "should not extract numeric hashtags" do
      @extractor.extract_hashtags("#1234").should == []
    end
  end

end