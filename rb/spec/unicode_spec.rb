# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe Twitter::TwitterText::Unicode do

  it "should lazy-init constants" do
    expect(Twitter::TwitterText::Unicode.const_defined?(:UFEB6)).to eq(false)
    expect(Twitter::TwitterText::Unicode::UFEB6).to_not be_nil
    expect(Twitter::TwitterText::Unicode::UFEB6).to be_kind_of(String)
    expect(Twitter::TwitterText::Unicode.const_defined?(:UFEB6)).to eq(true)
  end

  it "should return corresponding character" do
    expect(Twitter::TwitterText::Unicode::UFEB6).to be == [0xfeb6].pack('U')
  end

  it "should allow lowercase notation" do
    expect(Twitter::TwitterText::Unicode::Ufeb6).to be == Twitter::TwitterText::Unicode::UFEB6
    expect(Twitter::TwitterText::Unicode::Ufeb6).to be === Twitter::TwitterText::Unicode::UFEB6
  end

  it "should allow underscore notation" do
    expect(Twitter::TwitterText::Unicode::U_FEB6).to be == Twitter::TwitterText::Unicode::UFEB6
    expect(Twitter::TwitterText::Unicode::U_FEB6).to be === Twitter::TwitterText::Unicode::UFEB6
  end

  it "should raise on invalid codepoints" do
    expect(lambda { Twitter::TwitterText::Unicode::FFFFFF }).to raise_error(NameError)
  end

end
