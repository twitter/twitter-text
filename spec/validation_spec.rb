require File.dirname(__FILE__) + '/spec_helper'

describe Twitter::Validation do

  it "should disallow invalid BOM character" do
    Twitter::Validation.invalid?("Bom:#{Twitter::Unicode::UFFFE}").should == :invalid_characters
    Twitter::Validation.invalid?("Bom:#{Twitter::Unicode::UFEFF}").should == :invalid_characters
  end

  it "should disallow invalid U+FFFF character" do
    Twitter::Validation.invalid?("Bom:#{Twitter::Unicode::UFFFF}").should == :invalid_characters
  end

  it "should disallow direction change characters" do
    [0x202A, 0x202B, 0x202C, 0x202D, 0x202E].map{|cp| [cp].pack('U') }.each do |char|
      Twitter::Validation.invalid?("Invalid:#{char}").should == :invalid_characters
    end
  end

  it "should allow <= 140 combined accent characters" do
    char = [0x65, 0x0301].pack('U')
    Twitter::Validation.invalid?(char * 139).should == false
    Twitter::Validation.invalid?(char * 140).should == false
    Twitter::Validation.invalid?(char * 141).should == :too_long
  end

  it "should allow <= 140 multi-byte characters" do
    char = [0x1d106].pack('U')
    Twitter::Validation.invalid?(char * 139).should == false
    Twitter::Validation.invalid?(char * 140).should == false
    Twitter::Validation.invalid?(char * 141).should == :too_long
  end

end