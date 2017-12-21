# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

class TestValidation
  include Twitter::TwitterText::Validation
end

describe Twitter::TwitterText::Validation do

  it "should disallow invalid BOM character" do
    expect(TestValidation.new.tweet_invalid?("Bom:#{Twitter::TwitterText::Unicode::UFFFE}")).to be == :invalid_characters
    expect(TestValidation.new.tweet_invalid?("Bom:#{Twitter::TwitterText::Unicode::UFEFF}")).to be == :invalid_characters
  end

  it "should disallow invalid U+FFFF character" do
    expect(TestValidation.new.tweet_invalid?("Bom:#{Twitter::TwitterText::Unicode::UFFFF}")).to be == :invalid_characters
  end

  it "should disallow direction change characters" do
    [0x202A, 0x202B, 0x202C, 0x202D, 0x202E].map{|cp| [cp].pack('U') }.each do |char|
      expect(TestValidation.new.tweet_invalid?("Invalid:#{char}")).to eq(:invalid_characters)
    end
  end

  it "should disallow non-Unicode" do
    expect(TestValidation.new.tweet_invalid?("not-Unicode:\xfff0")).to be == :invalid_characters
  end

  it "should allow <= 140 combined accent characters" do
    char = [0x65, 0x0301].pack('U')
    expect(TestValidation.new.tweet_invalid?(char * 139)).to be false
    expect(TestValidation.new.tweet_invalid?(char * 140)).to be false
    expect(TestValidation.new.tweet_invalid?(char * 141)).to eq(:too_long)
  end

  it "should allow <= 140 multi-byte characters" do
    char = [ 0x1d106 ].pack('U')
    expect(TestValidation.new.tweet_invalid?(char * 139)).to be false
    expect(TestValidation.new.tweet_invalid?(char * 140)).to be false
    expect(TestValidation.new.tweet_invalid?(char * 141)).to eq(:too_long)
  end

  context "when returning results" do
    it "should properly create new fully-populated results from arguments" do
      results = Twitter::TwitterText::Validation::ParseResults.new(weighted_length: 26, permillage: 92, valid: true, display_range_start: 0, display_range_end: 16, valid_range_start: 0, valid_range_end:16)
      expect(results).to_not be nil
      expect(results[:weighted_length]).to eq(26)
      expect(results[:permillage]).to eq(92)
      expect(results[:valid]).to be true
      expect(results[:display_range_start]).to eq(0)
      expect(results[:display_range_end]).to eq(16)
      expect(results[:valid_range_start]).to eq(0)
      expect(results[:valid_range_end]).to eq(16)
    end

    it "should properly create empty results" do
      results = Twitter::TwitterText::Validation::ParseResults.empty()
      expect(results[:weighted_length]).to eq(0)
      expect(results[:permillage]).to eq(0)
      expect(results[:valid]).to be true
      expect(results[:display_range_start]).to eq(0)
      expect(results[:display_range_end]).to eq(0)
      expect(results[:valid_range_start]).to eq(0)
      expect(results[:valid_range_end]).to eq(0)
    end
  end
end
