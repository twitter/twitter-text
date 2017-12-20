# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe Twitter::TextConfiguration do
  context "configuration" do
    context "with invalid data" do
      it "should raise an exception" do
        invalid_hash = Twitter::TextConfiguration.parse_string("{\"version\":2,\"maxWeightedTweetLength\":280,\"scale\":100,\"defaultWeight\":200,\"transformedURLLength\":23,\"ranges\":[{\"start\":0,\"end\":true,\"weight\":false},{\"start\":8192,\"end\":8205,\"weight\":100},{\"start\":8208,\"end\":8223,\"weight\":100},{\"start\":8242,\"end\":8247,\"weight\":100}]}")
        expect { Twitter::TextConfiguration.new(invalid_hash) }.to raise_error(ArgumentError)
      end
    end

    context "with defaults" do
      before do
        Twitter::TextConfiguration.default_configuration = Twitter::TextConfiguration.configuration_from_file(Twitter::TextConfiguration::CONFIG_V2)
      end

      it "should define version constants" do
        expect(Twitter::TextConfiguration.const_defined?(:CONFIG_V1)).to be true
        expect(Twitter::TextConfiguration.const_defined?(:CONFIG_V2)).to be true
      end

      it "should define a default configuration" do
        expect(Twitter::TextConfiguration.default_configuration).to_not be_nil
        expect(Twitter::TextConfiguration.default_configuration.version).to eq(2)
      end
    end

    context "with v1 configuration" do
      before do
        @config = Twitter::TextConfiguration.configuration_from_file(Twitter::TextConfiguration::CONFIG_V1)
      end

      it "should have a version" do
        expect(@config.version).to eq(1)
      end

      it "should have a max_weighted_tweet_length" do
        expect(@config.max_weighted_tweet_length).to eq(140)
      end

      it "should have a scale" do
        expect(@config.scale).to eq(1)
      end

      it "should have a default_weight" do
        expect(@config.default_weight).to eq(1)
      end

      it "should have a transformed_url_length" do
        expect(@config.transformed_url_length).to eq(23)
      end
    end

    context "with v2 configuration" do
      before do
        @config = Twitter::TextConfiguration.configuration_from_file(Twitter::TextConfiguration::CONFIG_V2)
      end

      it "should have a version" do
        expect(@config.version).to eq(2)
      end

      it "should have a max_weighted_tweet_length" do
        expect(@config.max_weighted_tweet_length).to eq(280)
      end

      it "should have a scale" do
        expect(@config.scale).to eq(100)
      end

      it "should have a default_weight" do
        expect(@config.default_weight).to eq(200)
      end

      it "should have a transformed_url_length" do
        expect(@config.transformed_url_length).to eq(23)
      end

      it "should have a configured range" do
        expect(@config.ranges).to be_kind_of(Array)
        expect(@config.ranges.count).to be > 0
        expect(@config.ranges[0]).to be_kind_of(Twitter::WeightedRange)
        weighted_range = @config.ranges[0]
        expect(weighted_range.start).to be_kind_of(Integer)
        expect(weighted_range.end).to be_kind_of(Integer)
        expect(weighted_range.weight).to be_kind_of(Integer)
      end
    end
  end
end
