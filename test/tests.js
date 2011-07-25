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

  // Hashtag Overrides
  ok(twttr.txt.autoLink("#hi", { before: "!" }).match(/!<a[^>]+>#hi<\/a>/), "Override before");
  ok(twttr.txt.autoLink("#hi", { hash: "!" }).match(/<a[^>]+>!hi<\/a>/), "Override hash");
  ok(twttr.txt.autoLink("#hi", { preText: "<b>" }).match(/<a[^>]+>#<b>hi<\/a>/), "Override preText");
  ok(twttr.txt.autoLink("#hi", { postText: "</b>" }).match(/<a[^>]+>#hi<\/b><\/a>/), "Override postText");
});