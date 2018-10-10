# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe "Twitter::TwitterText::Regex regular expressions" do
  describe "matching URLS" do
    TestUrls::VALID.each do |url|
      it "should match the URL #{url}" do
        expect(url).to match_autolink_expression
      end

      it "should match the URL #{url} when it's embedded in other text" do
        text = "Sweet url: #{url} I found. #awesome"
        expect(url).to match_autolink_expression_in(text)
      end
    end
  end

  describe "invalid URLS" do
    it "does not link urls with invalid characters" do
      TestUrls::INVALID.each {|url| expect(url).to_not match_autolink_expression}
    end
  end

  describe "matching List names" do
    it "should match if less than 25 characters" do
      name = "Shuffleboard Community"
      expect(name.length).to be < 25
      expect(name).to match(Twitter::TwitterText::Regex::REGEXEN[:list_name])
    end

    it "should not match if greater than 25 characters" do
      name = "Most Glorious Shady Meadows Shuffleboard Community"
      expect(name.length).to be > 25
      expect(name).to match(Twitter::TwitterText::Regex[:list_name])
    end

  end

  describe "matching Unicode 10.0 emoji" do
    it "should match new emoji" do
      input = "Unicode 10.0; grinning face with one large and one small eye: 🤪; woman with headscarf: 🧕; (fitzpatrick) woman with headscarf + medium-dark skin tone: 🧕🏾; flag (England): 🏴󠁧󠁢󠁥󠁮󠁧󠁿"
      expected = ["🤪", "🧕", "🧕🏾", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"]
      entities = Twitter::TwitterText::Extractor.extract_emoji_with_indices(input)
      entities.each_with_index do |entity, i|
        expect(entity[:emoji]).to be_kind_of(String)
        expect(entity[:indices]).to be_kind_of(Array)
        entity[:indices].each do |position|
          expect(position).to be_kind_of(Integer)
        end
        expect(entity[:emoji]).to be == expected[i]
        expect(Twitter::TwitterText::Extractor.is_valid_emoji(entity[:emoji])).to be true
      end
    end
  end

  describe "matching Unicode 9.0 emoji" do
    it "should match new emoji" do
      input = "Unicode 9.0; face with cowboy hat: 🤠; woman dancing: 💃, woman dancing + medium-dark skin tone: 💃🏾"
      expected = ["🤠", "💃", "💃🏾"]
      entities = Twitter::TwitterText::Extractor.extract_emoji_with_indices(input)
      entities.each_with_index do |entity, i|
        expect(entity[:emoji]).to be_kind_of(String)
        expect(entity[:indices]).to be_kind_of(Array)
        entity[:indices].each do |position|
          expect(position).to be_kind_of(Integer)
        end
        expect(entity[:emoji]).to be == expected[i]
        expect(Twitter::TwitterText::Extractor.is_valid_emoji(entity[:emoji])).to be true
      end
    end
  end
end
