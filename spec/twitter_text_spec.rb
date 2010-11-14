require File.dirname(__FILE__) + '/spec_helper'

describe "base" do

  before do
    $KCODE = 'NONE'
  end

  after do
    $KCODE = 'u'
  end

  it "should raise with invalid KCODE" do
    lambda do
      require 'twitter-text'
    end.should raise_error
  end

end
