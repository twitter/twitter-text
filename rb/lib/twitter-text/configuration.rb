# encoding: UTF-8

module Twitter
  module TwitterText
    class Configuration
      require 'json'

      PARSER_VERSION_CLASSIC = "v1"
      PARSER_VERSION_DEFAULT = "v2"

      class << self
        attr_accessor :default_configuration
      end

      attr_reader :version, :max_weighted_tweet_length, :scale
      attr_reader :default_weight, :transformed_url_length, :ranges

      CONFIG_V1 = File.join(
        File.expand_path('../../../config', __FILE__), # project root
        "#{PARSER_VERSION_CLASSIC}.json"
      )

      CONFIG_V2 = File.join(
        File.expand_path('../../../config', __FILE__), # project root
        "#{PARSER_VERSION_DEFAULT}.json"
      )

      def self.parse_string(string, options = {})
        JSON.parse(string, options.merge(symbolize_names: true))
      end

      def self.parse_file(filename)
        string = File.open(filename, 'rb') { |f| f.read }
        parse_string(string)
      end

      def self.configuration_from_file(filename)
        config = parse_file(filename)
        config ? self.new(config) : nil
      end

      def initialize(config = {})
        @version = config[:version]
        @max_weighted_tweet_length = config[:maxWeightedTweetLength]
        @scale = config[:scale]
        @default_weight = config[:defaultWeight]
        @transformed_url_length = config[:transformedURLLength]
        @ranges = config[:ranges].map { |range| Twitter::TwitterText::WeightedRange.new(range) } if config.key?(:ranges) && config[:ranges].is_a?(Array)
      end

      self.default_configuration = self.configuration_from_file(CONFIG_V2)
    end
  end
end
