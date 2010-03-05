module TestUrls
  VALID = [
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
    "http://longtlds.info",
    "http://✪df.ws/ejp",
    "http://日本.com"
  ]

  INVALID = [
    "http://no-tld",
    "http://tld-too-short.x",
    "http://x.com/,,,/.../@@@/;;;/:::/---/%%%x",
    "http://domain-dash.com",
    "http://-doman_dash.com"
  ]

end
