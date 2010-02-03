require File.dirname(__FILE__) + '/spec_helper'

describe "Twitter::Regex regular expressions" do
  describe "matching URLS" do
    TestUrls::VALID.each do |url|
      it "should match the URL #{url}" do
        url.should match_autolink_expression
      end

      it "should match the URL #{url} when it's embedded in other text" do
        text = "Sweet url: #{url} I found. #awesome"
        url.should match_autolink_expression_in(text)
      end
    end
  end

  describe "invalid URLS" do
    it "does not link urls with invalid characters" do
      TestUrls::INVALID.each {|url| url.should_not have_autolinked_url(url)}
    end
    
    it "does not link domains beginning with a hypen" do
      pending
      "http://-doman_dash_2314352345_dfasd.com".should_not match_autolink_expression
    end
  end

end
