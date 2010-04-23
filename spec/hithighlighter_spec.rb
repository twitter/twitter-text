require File.dirname(__FILE__) + '/spec_helper'

class TestHitHighlighter
  include Twitter::HitHighlighter
end

describe Twitter::HitHighlighter do
  describe "highlight" do
    before do
      @highlighter = TestHitHighlighter.new
    end
    
    context "without links" do
      before do
        @original = "Hey! this is a test tweet"
      end
      
      it "should return original when no hits are provided" do
        @highlighter.hit_highlight(@original).should == @original
      end
      
      it "should highlight one hit" do
        @highlighter.hit_highlight(@original, hits = [[5, 9]]).should == "Hey! <b>this</b> is a test tweet"
      end
      
      it "should highlight two hits" do
        @highlighter.hit_highlight(@original, hits = [[5, 9], [15, 19]]).should == "Hey! <b>this</b> is a <b>test</b> tweet"
      end
      
    end
    
    context "with links" do
      it "should highlight with a single link" do
        @highlighter.hit_highlight("@<a>bcherry</a> this was a test tweet", [[9, 13]]).should == "@<a>bcherry</a> <b>this</b> was a test tweet"
      end
      
      it "should highlight with link at the end" do
        @highlighter.hit_highlight("test test <a>test</a>", [[5, 9]]).should == "test <b>test</b> <a>test</a>"
      end
      
      it "should highlight with a link at the beginning" do
        @highlighter.hit_highlight("<a>test</a> test test", [[5, 9]]).should == "<a>test</a> <b>test</b> test"
      end
      
      it "should highlight an entire link" do
        @highlighter.hit_highlight("test <a>test</a> test", [[5, 9]]).should == "test <a><b>test</b></a> test"
      end
      
      it "should highlight within a link" do
        @highlighter.hit_highlight("test <a>test</a> test", [[6, 8]]).should == "test <a>t<b>es</b>t</a> test"
      end
      
      it "should highlight around a link" do
        @highlighter.hit_highlight("test <a>test</a> test", [[3, 11]]).should == "tes<b>t <a>test</a> t</b>est"
      end
      
    end
    
  end

end