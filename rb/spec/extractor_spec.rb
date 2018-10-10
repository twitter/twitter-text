# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

class TestExtractor
  include Twitter::TwitterText::Extractor
end

describe Twitter::TwitterText::Extractor do
  before do
    @extractor = TestExtractor.new
  end

  describe "mentions" do
    context "single screen name alone " do
      it "should be linked" do
        expect(@extractor.extract_mentioned_screen_names("@alice")).to be == ["alice"]
      end

      it "should be linked with _" do
        expect(@extractor.extract_mentioned_screen_names("@alice_adams")).to be == ["alice_adams"]
      end

      it "should be linked if numeric" do
        expect(@extractor.extract_mentioned_screen_names("@1234")).to be == ["1234"]
      end
    end

    context "multiple screen names" do
      it "should both be linked" do
        expect(@extractor.extract_mentioned_screen_names("@alice @bob")).to be == ["alice", "bob"]
      end
    end

    context "screen names embedded in text" do
      it "should be linked in Latin text" do
        expect(@extractor.extract_mentioned_screen_names("waiting for @alice to arrive")).to be == ["alice"]
      end

      it "should be linked in Japanese text" do
        expect(@extractor.extract_mentioned_screen_names("の@aliceに到着を待っている")).to be == ["alice"]
      end

      it "should ignore mentions preceded by !, @, #, $, %, & or *" do
        invalid_chars = ['!', '@', '#', '$', '%', '&', '*']
        invalid_chars.each do |c|
          expect(@extractor.extract_mentioned_screen_names("f#{c}@kn")).to be == []
        end
      end
    end

    it "should accept a block arugment and call it in order" do
      needed = ["alice", "bob"]
      @extractor.extract_mentioned_screen_names("@alice @bob") do |sn|
        expect(sn).to be == needed.shift
      end
      expect(needed).to be == []
    end
  end

  describe "mentions with indices" do
    context "single screen name alone " do
      it "should be linked and the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("@alice")).to be == [{:screen_name => "alice", :indices => [0, 6]}]
      end

      it "should be linked with _ and the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("@alice_adams")).to be == [{:screen_name => "alice_adams", :indices => [0, 12]}]
      end

      it "should be linked if numeric and the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("@1234")).to be == [{:screen_name => "1234", :indices => [0, 5]}]
      end
    end

    context "multiple screen names" do
      it "should both be linked with the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("@alice @bob")).to be ==
          [{:screen_name => "alice", :indices => [0, 6]},
           {:screen_name => "bob", :indices => [7, 11]}]
      end

      it "should be linked with the correct indices even when repeated" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("@alice @alice @bob")).to be ==
          [{:screen_name => "alice", :indices => [0, 6]},
           {:screen_name => "alice", :indices => [7, 13]},
           {:screen_name => "bob", :indices => [14, 18]}]
      end
    end

    context "screen names embedded in text" do
      it "should be linked in Latin text with the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("waiting for @alice to arrive")).to be == [{:screen_name => "alice", :indices => [12, 18]}]
      end

      it "should be linked in Japanese text with the correct indices" do
        expect(@extractor.extract_mentioned_screen_names_with_indices("の@aliceに到着を待っている")).to be == [{:screen_name => "alice", :indices => [1, 7]}]
      end
    end

    it "should accept a block arugment and call it in order" do
      needed = [{:screen_name => "alice", :indices => [0, 6]}, {:screen_name => "bob", :indices => [7, 11]}]
      @extractor.extract_mentioned_screen_names_with_indices("@alice @bob") do |sn, start_index, end_index|
        data = needed.shift
        expect(sn).to be == data[:screen_name]
        expect(start_index).to be == data[:indices].first
        expect(end_index).to be == data[:indices].last
      end
      expect(needed).to be == []
    end

    it "should extract screen name in text with supplementary character" do
      expect(@extractor.extract_mentioned_screen_names_with_indices("#{[0x10400].pack('U')} @alice")).to be == [{:screen_name => "alice", :indices => [2, 8]}]
    end
  end

  describe "replies" do
    context "should be extracted from" do
      it "should extract from lone name" do
        expect(@extractor.extract_reply_screen_name("@alice")).to be == "alice"
      end

      it "should extract from the start" do
        expect(@extractor.extract_reply_screen_name("@alice reply text")).to be == "alice"
      end

      it "should extract preceded by a space" do
        expect(@extractor.extract_reply_screen_name(" @alice reply text")).to be == "alice"
      end

      it "should extract preceded by a full-width space" do
        expect(@extractor.extract_reply_screen_name("#{[0x3000].pack('U')}@alice reply text")).to be == "alice"
      end
    end

    context "should not be extracted from" do
      it "should not be extracted when preceded by text" do
        expect(@extractor.extract_reply_screen_name("reply @alice text")).to be == nil
      end

      it "should not be extracted when preceded by puctuation" do
        %w(. / _ - + # ! @).each do |punct|
          expect(@extractor.extract_reply_screen_name("#{punct}@alice text")).to be == nil
        end
      end
    end

    context "should accept a block arugment" do
      it "should call the block on match" do
        @extractor.extract_reply_screen_name("@alice") do |sn|
          expect(sn).to be == "alice"
        end
      end

      it "should not call the block on no match" do
        calls = 0
        @extractor.extract_reply_screen_name("not a reply") do |sn|
          calls += 1
        end
        expect(calls).to be == 0
      end
    end
  end

  describe "urls" do
    describe "matching URLS" do
      TestUrls::VALID.each do |url|
        it "should extract the URL #{url} and prefix it with a protocol if missing" do
          expect(@extractor.extract_urls(url).first).to include(url)
        end

        it "should match the URL #{url} when it's embedded in other text" do
          text = "Sweet url: #{url} I found. #awesome"
          expect(@extractor.extract_urls(text).first).to include(url)
        end
      end
    end

    describe "invalid URLS" do
      TestUrls::INVALID.each do |url|
        it "does not extract URL from #{url}" do
          expect(@extractor.extract_urls(url).first).to be nil
        end
      end
    end

    describe "t.co URLS" do
      TestUrls::TCO.each do |url|
        it "should only extract the t.co URL from the URL #{url}" do
          extracted_urls = @extractor.extract_urls(url)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url).to_not be == url
          expect(extracted_url).to be == url[0...20]
        end

        it "should match the t.co URL from the URL #{url} when it's embedded in other text" do
          text = "Sweet url: #{url} I found. #awesome"
          extracted_urls = @extractor.extract_urls(text)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url).to_not be == url
          expect(extracted_url).to be == url[0...20]
        end
      end
    end
  end

  describe "urls with indices" do
    describe "matching URLS" do
      TestUrls::VALID.each do |url|
        it "should extract the URL #{url} and prefix it with a protocol if missing" do
          extracted_urls = @extractor.extract_urls_with_indices(url)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url[:url]).to include(url)
          expect(extracted_url[:indices].first).to be == 0
          expect(extracted_url[:indices].last).to be == url.chars.to_a.size
        end

        it "should match the URL #{url} when it's embedded in other text" do
          text = "Sweet url: #{url} I found. #awesome"
          extracted_urls = @extractor.extract_urls_with_indices(text)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url[:url]).to include(url)
          expect(extracted_url[:indices].first).to be == 11
          expect(extracted_url[:indices].last).to be == 11 + url.chars.to_a.size
        end
      end

      it "should extract URL in text with supplementary character" do
        expect(@extractor.extract_urls_with_indices("#{[0x10400].pack('U')} http://twitter.com")).to be == [{:url => "http://twitter.com", :indices => [2, 20]}]
      end
    end

    describe "invalid URLS" do
      it "does not link urls with invalid domains" do
        expect(@extractor.extract_urls_with_indices("http://tld-too-short.x")).to be == []
      end

      it "does not consider a long URL with protocol to be valid" do
        # maximum length of domain label is 32 chars.
        url = ("a" * 31) + "."
        url *= (Twitter::TwitterText::Extractor::MAX_URL_LENGTH / 32)
        url = "https://" + url + "com" # longer than 4096 (MAX_URL_LENGTH) chars
        expect(@extractor.is_valid_domain(url.length, url, true)).to be false
      end

      it "does not consider a long URL without protocol to be valid" do
        # maximum length of domain label is 32 chars.
        url = ("a" * 31) + "."
        url *= ((Twitter::TwitterText::Extractor::MAX_URL_LENGTH / 32) - 1)
        url = url + "com" # shorter than 4096 (MAX_URL_LENGTH) chars
        expect(@extractor.is_valid_domain(url.length, url, false)).to be true
        url = ("a" * (31 - "https://".length)) + "." + url
        expect(@extractor.is_valid_domain(url.length, url, false)).to be false
      end
    end

    describe "t.co URLS" do
      TestUrls::TCO.each do |url|
        it "should only extract the t.co URL from the URL #{url} and adjust indices correctly" do
          extracted_urls = @extractor.extract_urls_with_indices(url)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url[:url]).to_not include(url)
          expect(extracted_url[:url]).to include(url[0...20])
          expect(extracted_url[:indices].first).to be == 0
          expect(extracted_url[:indices].last).to be == 20
        end

        it "should match the t.co URL from the URL #{url} when it's embedded in other text" do
          text = "Sweet url: #{url} I found. #awesome"
          extracted_urls = @extractor.extract_urls_with_indices(text)
          expect(extracted_urls.size).to be == 1
          extracted_url = extracted_urls.first
          expect(extracted_url[:url]).to_not include(url)
          expect(extracted_url[:url]).to include(url[0...20])
          expect(extracted_url[:indices].first).to be == 11
          expect(extracted_url[:indices].last).to be == 31
        end
      end
    end
  end

  describe "hashtags" do
    context "extracts latin/numeric hashtags" do
      %w(text text123 123text).each do |hashtag|
        it "should extract ##{hashtag}" do
          expect(@extractor.extract_hashtags("##{hashtag}")).to be == [hashtag]
        end

        it "should extract ##{hashtag} within text" do
          expect(@extractor.extract_hashtags("pre-text ##{hashtag} post-text")).to be == [hashtag]
        end
      end
    end

    context "international hashtags" do
      context "should allow accents" do
        %w(mañana café münchen).each do |hashtag|
          it "should extract ##{hashtag}" do
            expect(@extractor.extract_hashtags("##{hashtag}")).to be == [hashtag]
          end

          it "should extract ##{hashtag} within text" do
            expect(@extractor.extract_hashtags("pre-text ##{hashtag} post-text")).to be == [hashtag]
          end
        end

        it "should not allow the multiplication character" do
          expect(@extractor.extract_hashtags("#pre#{Twitter::TwitterText::Unicode::U00D7}post")).to be == ["pre"]
        end

        it "should not allow the division character" do
          expect(@extractor.extract_hashtags("#pre#{Twitter::TwitterText::Unicode::U00F7}post")).to be == ["pre"]
        end
      end

    end

    it "should not extract numeric hashtags" do
      expect(@extractor.extract_hashtags("#1234")).to be == []
    end

    it "should extract hashtag followed by punctuations" do
      expect(@extractor.extract_hashtags("#test1: #test2; #test3\"")).to be == ["test1", "test2" ,"test3"]
    end
  end

  describe "hashtags with indices" do
    def match_hashtag_in_text(hashtag, text, offset = 0)
      extracted_hashtags = @extractor.extract_hashtags_with_indices(text)
      expect(extracted_hashtags.size).to be == 1
      extracted_hashtag = extracted_hashtags.first
      expect(extracted_hashtag[:hashtag]).to be == hashtag
      expect(extracted_hashtag[:indices].first).to be == offset
      expect(extracted_hashtag[:indices].last).to be == offset + hashtag.chars.to_a.size + 1
    end

    def not_match_hashtag_in_text(text)
      extracted_hashtags = @extractor.extract_hashtags_with_indices(text)
      expect(extracted_hashtags.size).to be == 0
    end

    context "extracts latin/numeric hashtags" do
      %w(text text123 123text).each do |hashtag|
        it "should extract ##{hashtag}" do
          match_hashtag_in_text(hashtag, "##{hashtag}")
        end

        it "should extract ##{hashtag} within text" do
          match_hashtag_in_text(hashtag, "pre-text ##{hashtag} post-text", 9)
        end
      end
    end

    context "international hashtags" do
      context "should allow accents" do
        %w(mañana café münchen).each do |hashtag|
          it "should extract ##{hashtag}" do
            match_hashtag_in_text(hashtag, "##{hashtag}")
          end

          it "should extract ##{hashtag} within text" do
            match_hashtag_in_text(hashtag, "pre-text ##{hashtag} post-text", 9)
          end
        end

        it "should not allow the multiplication character" do
          match_hashtag_in_text("pre", "#pre#{[0xd7].pack('U')}post", 0)
        end

        it "should not allow the division character" do
          match_hashtag_in_text("pre", "#pre#{[0xf7].pack('U')}post", 0)
        end
      end
    end

    it "should not extract numeric hashtags" do
      not_match_hashtag_in_text("#1234")
    end

    it "should extract hashtag in text with supplementary character" do
      match_hashtag_in_text("hashtag", "#{[0x10400].pack('U')} #hashtag", 2)
    end
  end
end
