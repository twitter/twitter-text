# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

major, minor, patch = RUBY_VERSION.split('.')
if major.to_i == 1 && minor.to_i < 9
  describe "base" do
    before do
      $KCODE = 'NONE'
    end

    after do
      $KCODE = 'u'
    end

    it "should raise with invalid KCODE on Ruby < 1.9" do
      expect(lambda do
        require 'twitter-text'
      end).to raise_error
    end
  end
end
