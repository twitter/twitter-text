# encoding: UTF-8

module Twitter
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
