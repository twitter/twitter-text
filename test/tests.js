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

test("twttr.txt.autolink", function() {
  // Username Overrides
  ok(twttr.txt.autoLink("@tw", { before: "!" }).match(/!@<a[^>]+>tw<\/a>/), "Override before");
  ok(twttr.txt.autoLink("@tw", { at: "!" }).match(/!<a[^>]+>tw<\/a>/), "Override at");
  ok(twttr.txt.autoLink("@tw", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw<\/a>/), "Override preChunk");
  ok(twttr.txt.autoLink("@tw", { postChunk: "</b>" }).match(/@<a[^>]+>tw<\/b><\/a>/), "Override postChunk");
  ok(!twttr.txt.autoLink("foo http://example.com", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to URL");

  // List Overrides
  ok(twttr.txt.autoLink("@tw/somelist", { before: "!" }).match(/!@<a[^>]+>tw\/somelist<\/a>/), "Override list before");
  ok(twttr.txt.autoLink("@tw/somelist", { at: "!" }).match(/!<a[^>]+>tw\/somelist<\/a>/), "Override list at");
  ok(twttr.txt.autoLink("@tw/somelist", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw\/somelist<\/a>/), "Override list preChunk");
  ok(twttr.txt.autoLink("@tw/somelist", { postChunk: "</b>" }).match(/@<a[^>]+>tw\/somelist<\/b><\/a>/), "Override list postChunk");
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
});
