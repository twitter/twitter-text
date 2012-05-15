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
    ["<a href=\"https://twitter.com\" target=\"_blank\">twitter & friends</a>", "&lt;a href=&quot;https://twitter.com&quot; target=&quot;_blank&quot;&gt;twitter &amp; friends&lt;/a&gt;"],
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

  var testCases = [
    {text:"abc", indices:[[0,3]], unicode_indices:[[0,3]]},
    {text:"\uD83D\uDE02abc", indices:[[2,5]], unicode_indices:[[1,4]]},
    {text:"\uD83D\uDE02abc\uD83D\uDE02", indices:[[2,5]], unicode_indices:[[1,4]]},
    {text:"\uD83D\uDE02abc\uD838\uDE02abc", indices:[[2,5], [7,10]], unicode_indices:[[1,4], [5,8]]},
    {text:"\uD83D\uDE02abc\uD838\uDE02abc\uD83D\uDE02", indices:[[2,5], [7,10]], unicode_indices:[[1,4], [5,8]]},
    {text:"\uD83D\uDE02\uD83D\uDE02abc", indices:[[4,7]], unicode_indices:[[2,5]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc", indices:[[6,9]], unicode_indices:[[3,6]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02", indices:[[6,9]], unicode_indices:[[3,6]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02", indices:[[6,9]], unicode_indices:[[3,6]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02", indices:[[8,11], [19,22]], unicode_indices:[[4,7], [11,14]]},
    {text:"\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02", indices:[[7,10], [18,21]], unicode_indices:[[4,7], [11,14]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uDE02", indices:[[8,11], [19,22]], unicode_indices:[[4,7], [11,14]]},
    {text:"\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02\uD83D\uDE02abc\uD83D\uDE02\uD83D\uDE02\uD83D\uD83D\uDE02\uDE02", indices:[[8,11], [19,22]], unicode_indices:[[4,7], [11,14]]},
    {text:"\uD83Dabc\uD83D", indices:[[1,4]], unicode_indices:[[1,4]]},
    {text:"\uDE02abc\uDE02", indices:[[1,4]], unicode_indices:[[1,4]]},
    {text:"\uDE02\uDE02abc\uDE02\uDE02", indices:[[2,5]], unicode_indices:[[2,5]]},
    {text:"abcabc", indices:[[0,3], [3,6]], unicode_indices:[[0,3], [3,6]]},
    {text:"abc\uD83D\uDE02abc", indices:[[0,3], [5,8]], unicode_indices:[[0,3], [4,7]]},
    {text:"aa", indices:[[0,1], [1,2]], unicode_indices:[[0,1], [1,2]]},
    {text:"\uD83D\uDE02a\uD83D\uDE02a\uD83D\uDE02", indices:[[2,3], [5,6]], unicode_indices:[[1,2], [3,4]]}
  ];

  for (var i = 0; i < testCases.length; i++) {
    entities = [];
    for (var j = 0; j < testCases[i].indices.length; j++) {
      entities.push({indices:testCases[i].indices[j]});
    }
    twttr.txt.modifyIndicesFromUTF16ToUnicode(testCases[i].text, entities);
    for (var j = 0; j < testCases[i].indices.length; j++) {
      same(entities[j].indices, testCases[i].unicode_indices[j], "Convert UTF16 indices to Unicode indices for text '" + testCases[i].text +"'");
    }
    twttr.txt.modifyIndicesFromUnicodeToUTF16(testCases[i].text, entities);
    for (var j = 0; j < testCases[i].indices.length; j++) {
      same(entities[j].indices, testCases[i].indices[j], "Convert Unicode indices to UTF16 indices for text '" + testCases[i].text +"'");
    }
  }
});

test("twttr.txt.autolink", function() {
  // Username Overrides
  ok(twttr.txt.autoLink("@tw", { before: "!" }).match(/!@<a[^>]+>tw<\/a>/), "Override before");
  ok(twttr.txt.autoLink("@tw", { at: "!" }).match(/!<a[^>]+>tw<\/a>/), "Override at");
  ok(twttr.txt.autoLink("@tw", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw<\/a>/), "Override preChunk");
  ok(twttr.txt.autoLink("@tw", { postChunk: "</b>" }).match(/@<a[^>]+>tw<\/b><\/a>/), "Override postChunk");
  same(twttr.txt.autoLink("@tw", { usernameIncludeSymbol: true }), "<a class=\"tweet-url username\" data-screen-name=\"tw\" href=\"https://twitter.com/tw\" rel=\"nofollow\">@tw</a>",
      "Include @ in the autolinked username");
  ok(!twttr.txt.autoLink("foo http://example.com", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to URL");

  // List Overrides
  ok(twttr.txt.autoLink("@tw/somelist", { before: "!" }).match(/!@<a[^>]+>tw\/somelist<\/a>/), "Override list before");
  ok(twttr.txt.autoLink("@tw/somelist", { at: "!" }).match(/!<a[^>]+>tw\/somelist<\/a>/), "Override list at");
  ok(twttr.txt.autoLink("@tw/somelist", { preChunk: "<b>" }).match(/@<a[^>]+><b>tw\/somelist<\/a>/), "Override list preChunk");
  ok(twttr.txt.autoLink("@tw/somelist", { postChunk: "</b>" }).match(/@<a[^>]+>tw\/somelist<\/b><\/a>/), "Override list postChunk");
  same(twttr.txt.autoLink("@tw/somelist", { usernameIncludeSymbol: true }), "<a class=\"tweet-url list-slug\" href=\"https://twitter.com/tw/somelist\" rel=\"nofollow\">@tw/somelist</a>",
      "Include @ in the autolinked list");
  ok(twttr.txt.autoLink("foo @tw/somelist", { listClass: 'custom-list' }).match(/custom-list/), "Override listClass");
  ok(!twttr.txt.autoLink("foo @tw/somelist", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to a List");

  // Hashtag Overrides
  ok(twttr.txt.autoLink("#hi", { before: "!" }).match(/!<a[^>]+>#hi<\/a>/), "Override before");
  ok(twttr.txt.autoLink("#hi", { hash: "!" }).match(/<a[^>]+>!hi<\/a>/), "Override hash");
  ok(twttr.txt.autoLink("#hi", { preText: "<b>" }).match(/<a[^>]+>#<b>hi<\/a>/), "Override preText");
  ok(twttr.txt.autoLink("#hi", { postText: "</b>" }).match(/<a[^>]+>#hi<\/b><\/a>/), "Override postText");

  // url entities
  var autoLinkResult = twttr.txt.autoLink("http://t.co/0JG5Mcq", {
    invisibleTagAttrs: "style='font-size:0'",
    urlEntities: [{
      "url": "http://t.co/0JG5Mcq",
      "display_url": "blog.twitter.com/2011/05/twitte…",
      "expanded_url": "http://blog.twitter.com/2011/05/twitter-for-mac-update.html",
      "indices": [
        84,
        103
      ]
    }]
  });
  ok(autoLinkResult.match(/<a href="http:\/\/t.co\/0JG5Mcq"[^>]+>/), 'Use t.co URL as link target');
  ok(autoLinkResult.match(/>blog.twitter.com\/2011\/05\/twitte.*…</), 'Use display url from url entities');
  ok(autoLinkResult.match(/r-for-mac-update.html</), 'Include the tail of expanded_url');
  ok(autoLinkResult.match(/>http:\/\//), 'Include the head of expanded_url');
  ok(autoLinkResult.match(/span style='font-size:0'/), 'Obey invisibleTagAttrs');

  autoLinkResult = twttr.txt.autoLinkEntities("http://t.co/0JG5Mcq",
    [{
      "url": "http://t.co/0JG5Mcq",
      "display_url": "blog.twitter.com/2011/05/twitte…",
      "expanded_url": "http://blog.twitter.com/2011/05/twitter-for-mac-update.html",
      "indices": [0, 19]
    }]
  );
  ok(autoLinkResult.match(/<a href="http:\/\/t.co\/0JG5Mcq"[^>]+>/), 'autoLinkEntities: Use t.co URL as link target');
  ok(autoLinkResult.match(/>blog.twitter.com\/2011\/05\/twitte.*…</), 'autoLinkEntities: Use display url from entities');
  ok(autoLinkResult.match(/r-for-mac-update.html</), 'autoLinkEntities: Include the tail of expanded_url');
  ok(autoLinkResult.match(/>http:\/\//), 'autoLinkEntities: Include the head of expanded_url');

  // Insert the HTML into the document and verify that, if copied and pasted, it would get the expanded_url.
  var div = document.createElement('div');
  div.innerHTML = autoLinkResult;
  document.body.appendChild(div);
  var range = document.createRange();
  range.selectNode(div);
  ok(range.toString().match(/\shttp:\/\/blog.twitter.com\/2011\/05\/twitter-for-mac-update.html\s…/), 'Selection copies expanded_url');
  document.body.removeChild(div);

  var picTwitter = twttr.txt.autoLink("http://t.co/0JG5Mcq", {
    urlEntities: [{
      "url": "http://t.co/0JG5Mcq",
      "display_url": "pic.twitter.com/xyz",
      "expanded_url": "http://twitter.com/foo/statuses/123/photo/1",
      "indices": [
        84,
        103
      ]
    }]
  });
  ok(picTwitter.match(/<a href="http:\/\/t.co\/0JG5Mcq"[^>]+>/), 'Use t.co URL as link target');
  ok(picTwitter.match(/>pic.twitter.com\/xyz</), 'Use display url from url entities');
  ok(picTwitter.match(/title="http:\/\/twitter.com\/foo\/statuses\/123\/photo\/1"/), 'Use expanded url as title');
  ok(!picTwitter.match(/foo\/statuses</), 'Don\'t include the tail of expanded_url');

  // urls with invalid character
  var invalidChars = ['\u202A', '\u202B', '\u202C', '\u202D', '\u202E'];
  for (var i = 0; i < invalidChars.length; i++) {
    equal(twttr.txt.extractUrls("http://twitt" + invalidChars[i] + "er.com").length, 0, 'Should not extract URL with invalid character');
  }

  same(twttr.txt.autoLink("\uD801\uDC00 #hashtag \uD801\uDC00 @mention \uD801\uDC00 http://twitter.com"),
      "\uD801\uDC00 <a href=\"https://twitter.com/#!/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\" rel=\"nofollow\">#hashtag</a> \uD801\uDC00 @<a class=\"tweet-url username\" data-screen-name=\"mention\" href=\"https://twitter.com/mention\" rel=\"nofollow\">mention</a> \uD801\uDC00 <a href=\"http://twitter.com\" rel=\"nofollow\" >http://twitter.com</a>",
      "Autolink hashtag/mentionURL w/ Supplementary character");
});

test("twttr.txt.linkTextWithEntity", function() {
  var result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "twitter.com",
    "expanded_url": "http://twitter.com/"},
    {invisibleTagAttrs: "class='invisible'"});
  same(result,
      "<span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span><span class='invisible'>http://</span><span class='js-display-url'>twitter.com</span><span class='invisible'>/</span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span>",
      "Entire display_url is in expanded_url");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "twitter.com…",
    "expanded_url": "http://twitter.com/abcdefg"},
    {invisibleTagAttrs: "class='invisible'"});
  same(result,
      "<span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span><span class='invisible'>http://</span><span class='js-display-url'>twitter.com</span><span class='invisible'>/abcdefg</span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span>…</span>",
      "display_url ends with …");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "…tter.com/abcdefg",
    "expanded_url": "http://twitter.com/abcdefg"},
    {invisibleTagAttrs: "class='invisible'"});
  same(result,
      "<span class='tco-ellipsis'>…<span class='invisible'>&nbsp;</span></span><span class='invisible'>http://twi</span><span class='js-display-url'>tter.com/abcdefg</span><span class='invisible'></span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span>",
      "display_url begins with …");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "pic.twitter.com/xyz",
    "expanded_url": "http://twitter.com/foo/statuses/123/photo/1"},
    {invisibleTagAttrs: "class='invisible'"});
  same(result,
      "pic.twitter.com/xyz",
      "display_url and expanded_url are on different domains");
});

test("twttr.txt.extractMentionsOrListsWithIndices", function() {
  var invalid_chars = ['!', '@', '#', '$', '%', '&', '*'];

  for (var i = 0; i < invalid_chars.length; i++) {
    c = invalid_chars[i];
    equal(twttr.txt.extractMentionsOrListsWithIndices("f" + c + "@kn").length, 0, "Should not extract mention if preceded by " + c);
  }
});
