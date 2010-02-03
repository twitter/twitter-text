require File.dirname(__FILE__) + '/spec_helper'

describe "Twitter::Regex regular expressions" do
  describe "matching URLS" do
    @urls = [
      "http://google.com",
      "http://foobar.com/#",
      "http://google.com/#foo",
      "http://google.com/#search?q=iphone%20-filter%3Alinks",
      "http://twitter.com/#search?q=iphone%20-filter%3Alinks",
      "http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html",
      "http://somehost.com:3000",
      "http://x.com/~matthew+%-x",
      "http://en.wikipedia.org/wiki/Primer_(film)",
      "http://www.ams.org/bookstore-getitem/item=mbk-59",
      "http://chilp.it/?77e8fd",
      "www.foobar.com",
      "WWW.FOOBAR.COM",
      "http://tell.me/why",
      "http://longtlds.mobi",
      "http://✪df.ws/ejp",
      "http://日本.com"
    ]

    @urls.each do |url|
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
      [ "http://doman-dash_2314352345_dfasd.foo-cow_4352.com",
        "http://no-tld",
        "http://tld-too-short.x",
        "http://x.com/,,,/.../@@@/;;;/:::/---/%%%x",
        "http://doman_dash_2314352345_dfasd.foo-cow_4352.com",
      ].each {|url| url.should_not have_autolinked_url(url)}
    end
    
    it "does not link domains beginning with a hypen" do
      pending
      "http://-doman_dash_2314352345_dfasd.com".should_not match_autolink_expression
    end
    
  end

end
