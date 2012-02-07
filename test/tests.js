module("twttr.txt");

test("twttr.txt.htmlEscape", function() {
  var tests = [
    ["&", "&amp;"],
    [">", "&gt;"],
    ["<", "&lt;"],
    ["\"", "&quot;"],
    ["'", "&#39;"],
    ["&<>\"", "&amp;&lt;&gt;&quot;"],
    ["<div>", "&lt;div&gt;"],
    ["a&b", "a&amp;b"],
    ["<a href=\"http://twitter.com\" target=\"_blank\">twitter & friends</a>", "&lt;a href=&quot;http://twitter.com&quot; target=&quot;_blank&quot;&gt;twitter &amp; friends&lt;/a&gt;"],
    ["&amp;", "&amp;amp;"],
    [undefined, undefined, "calling with undefined will return input"]
  ];

  for (var i = 0; i < tests.length; i++) {
    same(twttr.txt.htmlEscape(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
  }
});

test("twttr.txt.splitTags", function() {
  var tests = [
    ["foo", ["foo"]],
    ["foo<a>foo", ["foo", "a", "foo"]],
    ["<><>", ["", "", "", "", ""]],
    ["<a><em>foo</em></a>", ["", "a", "", "em", "foo", "/em", "", "/a", ""]]
  ];

  for (var i = 0; i < tests.length; i++) {
    same(twttr.txt.splitTags(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
  }
});

test("twttr.txt.extract", function() {
  var text = "\uD801\uDC00 #hashtag \uD801\uDC00 #hashtag";
  var extracted = twttr.txt.extractHashtagsWithIndices(text);
  same(extracted, [{hashtag:"hashtag", indices:[3, 11]}, {hashtag:"hashtag", indices:[15, 23]}], "Hashtag w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  same(extracted, [{hashtag:"hashtag", indices:[2, 10]}, {hashtag:"hashtag", indices:[13, 21]}], "Hashtag w/ Supplementary character, Unicode indices");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  same(extracted, [{hashtag:"hashtag", indices:[3, 11]}, {hashtag:"hashtag", indices:[15, 23]}], "Hashtag w/ Supplementary character, UTF-16 indices");

  text = "\uD801\uDC00 @mention \uD801\uDC00 @mention";
  extracted = twttr.txt.extractMentionsOrListsWithIndices(text);
  same(extracted, [{screenName:"mention", listSlug:"", indices:[3, 11]}, {screenName:"mention", listSlug:"", indices:[15, 23]}], "Mention w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  same(extracted, [{screenName:"mention", listSlug:"", indices:[2, 10]}, {screenName:"mention", listSlug:"", indices:[13, 21]}], "Mention w/ Supplementary character");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  same(extracted, [{screenName:"mention", listSlug:"", indices:[3, 11]}, {screenName:"mention", listSlug:"", indices:[15, 23]}], "Mention w/ Supplementary character, UTF-16 indices");

  text = "\uD801\uDC00 http://twitter.com \uD801\uDC00 http://test.com";
  extracted = twttr.txt.extractUrlsWithIndices(text);
  same(extracted, [{url:"http://twitter.com", indices:[3, 21]}, {url:"http://test.com", indices:[25, 40]}], "URL w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  same(extracted, [{url:"http://twitter.com", indices:[2, 20]}, {url:"http://test.com", indices:[23, 38]}], "URL w/ Supplementary character, Unicode indices");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  same(extracted, [{url:"http://twitter.com", indices:[3, 21]}, {url:"http://test.com", indices:[25, 40]}], "URL w/ Supplementary character, UTF-16 indices");
});

test("twttr.txt.autolink", function() {
  // Username Overrides
  ok(twttr.txt.autoLink("@tw", { before: "!" }).match(/!@<a[^>]+>tw<\/a>/), "Override before");
  ok(twttr.txt.autoLink("@tw", { at: "!" }).match(/!<a[^>]+>tw<\/a>/), "Override at");
  ok(twttr.txt.autoLink("@tw", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw<\/a>/), "Override preChunk");
  ok(twttr.txt.autoLink("@tw", { postChunk: "</b>" }).match(/@<a[^>]+>tw<\/b><\/a>/), "Override postChunk");
  ok(twttr.txt.autoLink("@tw", { usernameIncludeSymbol: true }) == "<a class=\"tweet-url username\" data-screen-name=\"tw\" href=\"http://twitter.com/tw\" rel=\"nofollow\">@tw</a>",
      "Include @ in the autolinked username");
  ok(!twttr.txt.autoLink("foo http://example.com", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to URL");

  // List Overrides
  ok(twttr.txt.autoLink("@tw/somelist", { before: "!" }).match(/!@<a[^>]+>tw\/somelist<\/a>/), "Override list before");
  ok(twttr.txt.autoLink("@tw/somelist", { at: "!" }).match(/!<a[^>]+>tw\/somelist<\/a>/), "Override list at");
  ok(twttr.txt.autoLink("@tw/somelist", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw\/somelist<\/a>/), "Override list preChunk");
  ok(twttr.txt.autoLink("@tw/somelist", { postChunk: "</b>" }).match(/@<a[^>]+>tw\/somelist<\/b><\/a>/), "Override list postChunk");
  ok(twttr.txt.autoLink("@tw/somelist", { usernameIncludeSymbol: true }) == "<a class=\"tweet-url list-slug\" href=\"http://twitter.com/tw/somelist\" rel=\"nofollow\">@tw/somelist</a>",
      "Include @ in the autolinked list");
  ok(twttr.txt.autoLink("foo @tw/somelist", { listClass: 'custom-list' }).match(/custom-list/), "Override listClass");
  ok(!twttr.txt.autoLink("foo @tw/somelist", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to a List");

  // Hashtag Overrides
  ok(twttr.txt.autoLink("#hi", { before: "!" }).match(/!<a[^>]+>#hi<\/a>/), "Override before");
  ok(twttr.txt.autoLink("#hi", { hash: "!" }).match(/<a[^>]+>!hi<\/a>/), "Override hash");
  ok(twttr.txt.autoLink("#hi", { preText: "<b>" }).match(/<a[^>]+>#<b>hi<\/a>/), "Override preText");
  ok(twttr.txt.autoLink("#hi", { postText: "</b>" }).match(/<a[^>]+>#hi<\/b><\/a>/), "Override postText");

  // url entities
  ok(twttr.txt.autoLink("http://t.co/0JG5Mcq", {
    urlEntities: [{
      "url": "http://t.co/0JG5Mcq",
      "display_url": "blog.twitter.com/2011/05/twitte…",
      "expanded_url": "http://blog.twitter.com/2011/05/twitter-for-mac-update.html",
      "indices": [
        84,
        103
      ]
    }]
  }).match(/<a href="http:\/\/t.co\/0JG5Mcq"[^>]+>blog.twitter.com\/2011\/05\/twitte…<\/a>/), 'Use display url from url entities');

  // urls with invalid character
  var invalidChars = ['\u202A', '\u202B', '\u202C', '\u202D', '\u202E'];
  for (i = 0; i < invalidChars.length; i++) {
    equal(twttr.txt.extractUrls("http://twitt" + invalidChars[i] + "er.com").length, 0, 'Should not extract URL with invalid cahracter');
  }

  same(twttr.txt.autoLink("\uD801\uDC00 #hashtag \uD801\uDC00 @mention \uD801\uDC00 http://twitter.com"),
      "\uD801\uDC00 <a href=\"http://twitter.com/#!/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\" rel=\"nofollow\">#hashtag</a> \uD801\uDC00 @<a class=\"tweet-url username\" data-screen-name=\"mention\" href=\"http://twitter.com/mention\" rel=\"nofollow\">mention</a> \uD801\uDC00 <a href=\"http://twitter.com\" rel=\"nofollow\" >http://twitter.com</a>",
      "Autolink hashtag/mentionURL w/ Supplementary character");
});
