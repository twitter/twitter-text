# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe "Twitter::Regex regular expressions" do
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
      expect(name).to match(Twitter::Regex::REGEXEN[:list_name])
    end

    it "should not match if greater than 25 characters" do
      name = "Most Glorious Shady Meadows Shuffleboard Community"
      expect(name.length).to be > 25
      expect(name).to match(Twitter::Regex[:list_name])
    end

  end
end
