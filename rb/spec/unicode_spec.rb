# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

describe Twitter::Unicode do

  it "should lazy-init constants" do
    expect(Twitter::Unicode.const_defined?(:UFEB6)).to eq(false)
    expect(Twitter::Unicode::UFEB6).to_not be_nil
    expect(Twitter::Unicode::UFEB6).to be_kind_of(String)
    expect(Twitter::Unicode.const_defined?(:UFEB6)).to eq(true)
  end

  it "should return corresponding character" do
    expect(Twitter::Unicode::UFEB6).to be == [0xfeb6].pack('U')
  end

  it "should allow lowercase notation" do
    expect(Twitter::Unicode::Ufeb6).to be == Twitter::Unicode::UFEB6
    expect(Twitter::Unicode::Ufeb6).to be === Twitter::Unicode::UFEB6
  end

  it "should allow underscore notation" do
    expect(Twitter::Unicode::U_FEB6).to be == Twitter::Unicode::UFEB6
    expect(Twitter::Unicode::U_FEB6).to be === Twitter::Unicode::UFEB6
  end

  it "should raise on invalid codepoints" do
    expect(lambda { Twitter::Unicode::FFFFFF }).to raise_error(NameError)
  end

end
