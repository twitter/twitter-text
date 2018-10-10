# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8
require File.dirname(__FILE__) + '/spec_helper'

class TestHitHighlighter
  include Twitter::TwitterText::HitHighlighter
end

describe Twitter::TwitterText::HitHighlighter do
  describe "highlight" do
    before do
      @highlighter = TestHitHighlighter.new
    end

    context "with options" do
      before do
        @original = "Testing this hit highliter"
        @hits = [[13,16]]
      end

      it "should default to <em> tags" do
        expect(@highlighter.hit_highlight(@original, @hits)).to be == "Testing this <em>hit</em> highliter"
      end

      it "should allow tag override" do
        expect(@highlighter.hit_highlight(@original, @hits, :tag => 'b')).to be == "Testing this <b>hit</b> highliter"
      end
    end

    context "without links" do
      before do
        @original = "Hey! this is a test tweet"
      end

      it "should return original when no hits are provided" do
        expect(@highlighter.hit_highlight(@original)).to be == @original
      end

      it "should highlight one hit" do
        expect(@highlighter.hit_highlight(@original, hits = [[5, 9]])).to be == "Hey! <em>this</em> is a test tweet"
      end

      it "should highlight two hits" do
        expect(@highlighter.hit_highlight(@original, hits = [[5, 9], [15, 19]])).to be == "Hey! <em>this</em> is a <em>test</em> tweet"
      end

      it "should correctly highlight first-word hits" do
        expect(@highlighter.hit_highlight(@original, hits = [[0, 3]])).to be == "<em>Hey</em>! this is a test tweet"
      end

      it "should correctly highlight last-word hits" do
        expect(@highlighter.hit_highlight(@original, hits = [[20, 25]])).to be == "Hey! this is a test <em>tweet</em>"
      end
    end

    context "with links" do
      it "should highlight with a single link" do
        expect(@highlighter.hit_highlight("@<a>bcherry</a> this was a test tweet", [[9, 13]])).to be == "@<a>bcherry</a> <em>this</em> was a test tweet"
      end

      it "should highlight with link at the end" do
        expect(@highlighter.hit_highlight("test test <a>test</a>", [[5, 9]])).to be == "test <em>test</em> <a>test</a>"
      end

      it "should highlight with a link at the beginning" do
        expect(@highlighter.hit_highlight("<a>test</a> test test", [[5, 9]])).to be == "<a>test</a> <em>test</em> test"
      end

      it "should highlight an entire link" do
        expect(@highlighter.hit_highlight("test <a>test</a> test", [[5, 9]])).to be == "test <a><em>test</em></a> test"
      end

      it "should highlight within a link" do
        expect(@highlighter.hit_highlight("test <a>test</a> test", [[6, 8]])).to be == "test <a>t<em>es</em>t</a> test"
      end

      it "should highlight around a link" do
        expect(@highlighter.hit_highlight("test <a>test</a> test", [[3, 11]])).to be == "tes<em>t <a>test</a> t</em>est"
      end

      it "should fail gracefully with bad hits" do
        expect(@highlighter.hit_highlight("test test", [[5, 20]])).to be == "test <em>test</em>"
      end

      it "should not mess up with touching tags" do
        expect(@highlighter.hit_highlight("<a>foo</a><a>foo</a>", [[3,6]])).to be == "<a>foo</a><a><em>foo</em></a>"
      end

    end

  end

end
