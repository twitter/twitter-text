# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: UTF-8

module Twitter
  module TwitterText
    class WeightedRange
      attr_reader :start, :end, :weight

      def initialize(range = {})
        raise ArgumentError.new("Invalid range") unless [:start, :end, :weight].all? { |key| range.key?(key) && range[key].is_a?(Integer) }
        @start = range[:start]
        @end = range[:end]
        @weight = range[:weight]
      end

      def contains?(code_point)
        code_point >= @start && code_point <= @end
      end
    end
  end
end
