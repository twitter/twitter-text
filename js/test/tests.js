// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

/* eslint-disable */
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
    deepEqual(twttr.txt.htmlEscape(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
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
    deepEqual(twttr.txt.splitTags(tests[i][0]), tests[i][1], tests[i][2] || tests[i][0]);
  }
});

test("twttr.txt.extract", function() {
  var text = "\uD801\uDC00 #hashtag \uD801\uDC00 #hashtag";
  var extracted = twttr.txt.extractHashtagsWithIndices(text);
  deepEqual(extracted, [{hashtag:"hashtag", indices:[3, 11]}, {hashtag:"hashtag", indices:[15, 23]}], "Hashtag w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  deepEqual(extracted, [{hashtag:"hashtag", indices:[2, 10]}, {hashtag:"hashtag", indices:[13, 21]}], "Hashtag w/ Supplementary character, Unicode indices");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  deepEqual(extracted, [{hashtag:"hashtag", indices:[3, 11]}, {hashtag:"hashtag", indices:[15, 23]}], "Hashtag w/ Supplementary character, UTF-16 indices");

  text = "\uD801\uDC00 @mention \uD801\uDC00 @mention";
  extracted = twttr.txt.extractMentionsOrListsWithIndices(text);
  deepEqual(extracted, [{screenName:"mention", listSlug:"", indices:[3, 11]}, {screenName:"mention", listSlug:"", indices:[15, 23]}], "Mention w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  deepEqual(extracted, [{screenName:"mention", listSlug:"", indices:[2, 10]}, {screenName:"mention", listSlug:"", indices:[13, 21]}], "Mention w/ Supplementary character");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  deepEqual(extracted, [{screenName:"mention", listSlug:"", indices:[3, 11]}, {screenName:"mention", listSlug:"", indices:[15, 23]}], "Mention w/ Supplementary character, UTF-16 indices");

  text = "\uD801\uDC00 http://twitter.com \uD801\uDC00 http://test.com";
  extracted = twttr.txt.extractUrlsWithIndices(text);
  deepEqual(extracted, [{url:"http://twitter.com", indices:[3, 21]}, {url:"http://test.com", indices:[25, 40]}], "URL w/ Supplementary character, UTF-16 indices");
  twttr.txt.modifyIndicesFromUTF16ToUnicode(text, extracted);
  deepEqual(extracted, [{url:"http://twitter.com", indices:[2, 20]}, {url:"http://test.com", indices:[23, 38]}], "URL w/ Supplementary character, Unicode indices");
  twttr.txt.modifyIndicesFromUnicodeToUTF16(text, extracted);
  deepEqual(extracted, [{url:"http://twitter.com", indices:[3, 21]}, {url:"http://test.com", indices:[25, 40]}], "URL w/ Supplementary character, UTF-16 indices");

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
      deepEqual(entities[j].indices, testCases[i].unicode_indices[j], "Convert UTF16 indices to Unicode indices for text '" + testCases[i].text +"'");
    }
    twttr.txt.modifyIndicesFromUnicodeToUTF16(testCases[i].text, entities);
    for (var j = 0; j < testCases[i].indices.length; j++) {
      deepEqual(entities[j].indices, testCases[i].indices[j], "Convert Unicode indices to UTF16 indices for text '" + testCases[i].text +"'");
    }
  }
});

test("twttr.txt.autolink", function() {
  // Username Overrides
  ok(twttr.txt.autoLink("@tw", { symbolTag: "s" }).match(/<s>@<\/s><a[^>]+>tw<\/a>/), "Apply symbolTag to @username");
  ok(!twttr.txt.autoLink("@tw", { symbolTag: "s" }).match(/symbolTag/i), "Do not include symbolTag attribute");
  ok(twttr.txt.autoLink("@tw", { textWithSymbolTag: "b" }).match(/@<a[^>]+><b>tw<\/b><\/a>/), "Apply textWithSymbolTag to @username");
  ok(!twttr.txt.autoLink("@tw", { textWithSymbolTag: "b" }).match(/textWithSymbolTag/i), "Do not include textWithSymbolTag attribute");
  ok(twttr.txt.autoLink("@tw", { symbolTag: "s", textWithSymbolTag: "b" }).match(/<s>@<\/s><a[^>]+><b>tw<\/b><\/a>/), "Apply symbolTag and textWithSymbolTag to @username");
  deepEqual(twttr.txt.autoLink("@tw", { usernameIncludeSymbol: true }), "<a class=\"tweet-url username\" href=\"https://twitter.com/tw\" data-screen-name=\"tw\" rel=\"nofollow\">@tw</a>",
      "Include @ in the autolinked username");
  ok(!twttr.txt.autoLink("foo http://example.com", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to URL");

  // List Overrides
  ok(twttr.txt.autoLink("@tw/somelist", { symbolTag: "s" }).match(/<s>@<\/s><a[^>]+>tw\/somelist<\/a>/), "Apply symbolTag to list");
  ok(twttr.txt.autoLink("@tw/somelist", { textWithSymbolTag: "b" }).match(/@<a[^>]+><b>tw\/somelist<\/b><\/a>/), "apply textWithSymbolTag to list");
  ok(twttr.txt.autoLink("@tw/somelist", { symbolTag: "s", textWithSymbolTag: "b" }).match(/<s>@<\/s><a[^>]+><b>tw\/somelist<\/b><\/a>/), "apply symbolTag and textWithSymbolTag to list");
  deepEqual(twttr.txt.autoLink("@tw/somelist", { usernameIncludeSymbol: true }), "<a class=\"tweet-url list-slug\" href=\"https://twitter.com/tw/somelist\" rel=\"nofollow\">@tw/somelist</a>",
      "Include @ in the autolinked list");
  ok(twttr.txt.autoLink("foo @tw/somelist", { listClass: 'custom-list' }).match(/custom-list/), "Override listClass");
  ok(!twttr.txt.autoLink("foo @tw/somelist", { usernameClass: 'custom-user' }).match(/custom-user/), "Override usernameClass should not be applied to a List");

  // Hashtag Overrides
  ok(twttr.txt.autoLink("#hi", { symbolTag: "s" }).match(/<a[^>]+><s>#<\/s>hi<\/a>/), "Apply symbolTag to hash");
  ok(twttr.txt.autoLink("#hi", { textWithSymbolTag: "b" }).match(/<a[^>]+>#<b>hi<\/b><\/a>/), "Apply textWithSymbolTag to hash");
  ok(twttr.txt.autoLink("#hi", { symbolTag: "s", textWithSymbolTag: "b" }).match(/<a[^>]+><s>#<\/s><b>hi<\/b><\/a>/), "Apply symbolTag and textWithSymbolTag to hash");

  // htmlEscapeNonEntities
  deepEqual(twttr.txt.autoLink("&<>\"'"), "&<>\"'", "Don't escape non-entities by default");
  deepEqual(twttr.txt.autoLink("&<>\"'", { htmlEscapeNonEntities: true } ), "&amp;&lt;&gt;&quot;&#39;", "Escape non-entities");
  deepEqual(twttr.txt.autoLink("& http://twitter.com/?a&b &", { htmlEscapeNonEntities: true }),
      "&amp; <a href=\"http://twitter.com/?a&amp;b\" rel=\"nofollow\">http://twitter.com/?a&amp;b</a> &amp;",
      "Escape non-entity text before and after a link while also escaping the link href and link text");

  // test urlClass
  deepEqual(twttr.txt.autoLink("http://twitter.com"), "<a href=\"http://twitter.com\" rel=\"nofollow\">http://twitter.com</a>", "AutoLink without urlClass");
  deepEqual(twttr.txt.autoLink("http://twitter.com", {urlClass: "testClass"}), "<a href=\"http://twitter.com\" class=\"testClass\" rel=\"nofollow\">http://twitter.com</a>", "autoLink with urlClass");
  ok(!twttr.txt.autoLink("#hash @tw", {urlClass: "testClass"}).match(/class=\"testClass\"/), "urlClass won't be used for hashtag and @mention auto-links");

  // test urlTarget
  var autoLinkResult = twttr.txt.autoLink("#hashtag @mention http://test.com", {urlTarget:'_blank'});
  ok(!autoLinkResult.match(/<a[^>]+hashtag[^>]+target[^>]+>/), "urlTarget shouldn't be applied to auto-linked hashtag");
  ok(!autoLinkResult.match(/<a[^>]+username[^>]+target[^>]+>/), "urlTarget shouldn't be applied to auto-linked mention");
  ok(autoLinkResult.match(/<a[^>]+test.com[^>]+target=\"_blank\"[^>]*>/), "urlTarget should be applied to auto-linked URL");
  ok(!autoLinkResult.match(/urlClass/i), "urlClass should not appear in HTML");

  // test linkAttributeBlock
  autoLinkResult = twttr.txt.autoLink("#hash @mention", {linkAttributeBlock: function(entity, attributes) {if (entity.hashtag) attributes["dummy-hash-attr"] = "test";}});
  ok(autoLinkResult.match(/<a[^>]+hashtag[^>]+dummy-hash-attr=\"test\"[^>]*>/), "linkAttributeBlock should be applied to hashtag");
  ok(!autoLinkResult.match(/<a[^>]+username[^>]+dummy-hash-attr=\"test\"[^>]*>/), "linkAttributeBlock should not be applied to mention");
  ok(!autoLinkResult.match(/linkAttributeBlock/i), "linkAttributeBlock should not appear in HTML");

  autoLinkResult = twttr.txt.autoLink("@mention http://twitter.com/", {linkAttributeBlock: function(entity, attributes) {if (entity.url) attributes["dummy-url-attr"] = entity.url;}});
  ok(!autoLinkResult.match(/<a[^>]+username[^>]+dummy-hash-attr=\"test\"[^>]*>/), "linkAttributeBlock should not be applied to mention");
  ok(autoLinkResult.match(/<a[^>]+dummy-url-attr=\"http:\/\/twitter.com\/\"/), "linkAttributeBlock should be applied to URL");

  // test targetBlank
  ok(!twttr.txt.autoLink("#hash @mention").match(/target="_blank"/), "target=\"blank\" attribute should not be added to link");
  ok(twttr.txt.autoLink("#hash @mention", { targetBlank: true }).match(/target="_blank"/), "target=\"blank\" attribute should be added to link");

  // test linkTextBlock
  autoLinkResult = twttr.txt.autoLink("#hash @mention", {
      linkTextBlock: function(entity, text) {
        return entity.hashtag ? "#replaced" : "pre_" + text + "_post";
      }
  });
  ok(autoLinkResult.match(/<a[^>]+>#replaced<\/a>/), "linkTextBlock should modify a hashtag link text");
  ok(autoLinkResult.match(/<a[^>]+>pre_mention_post<\/a>/), "linkTextBlock should modify a username link text");
  ok(!autoLinkResult.match(/linkTextBlock/i), "linkTextBlock should not appear in HTML");

  autoLinkResult = twttr.txt.autoLink("#hash @mention", {
    linkTextBlock: function(entity, text) {
      return "pre_" + text +"_post";
    },
    symbolTag: "s", textWithSymbolTag: "b", usernameIncludeSymbol: true
  });
  ok(autoLinkResult.match(/<a[^>]+>pre_<s>#<\/s><b>hash<\/b>_post<\/a>/), "linkTextBlock should modify a hashtag link text");
  ok(autoLinkResult.match(/<a[^>]+>pre_<s>@<\/s><b>mention<\/b>_post<\/a>/), "linkTextBlock should modify a username link text");

  // extractUrlsWithoutProtocol (the default mode of extractEntitiesWithIndices)
  deepEqual(twttr.txt.autoLinkEntities("twitter.com", twttr.txt.extractEntitiesWithIndices("twitter.com")),
      "<a href=\"http://twitter.com\" rel=\"nofollow\">twitter.com</a>", "AutoLink with extractUrlsWithoutProtocol");
  deepEqual(twttr.txt.autoLinkEntities("TWITTER.JP", twttr.txt.extractEntitiesWithIndices("TWITTER.JP")),
      "<a href=\"http://TWITTER.JP\" rel=\"nofollow\">TWITTER.JP</a>", "AutoLink with extractUrlsWithoutProtocol with ccTLD domains");

  // url entities
  autoLinkResult = twttr.txt.autoLink("http://t.co/0JG5Mcq", {
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
  var invalidChars = ['\uFEFF'];
  for (var i = 0; i < invalidChars.length; i++) {
    equal(twttr.txt.extractUrls("http://twitt" + invalidChars[i] + "er.com").length, 0, 'Should not extract URL with invalid character');
  }

  deepEqual(twttr.txt.autoLink("\uD801\uDC00 #hashtag \uD801\uDC00 @mention \uD801\uDC00 http://twitter.com"),
      "\uD801\uDC00 <a href=\"https://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\" rel=\"nofollow\">#hashtag</a> \uD801\uDC00 @<a class=\"tweet-url username\" href=\"https://twitter.com/mention\" data-screen-name=\"mention\" rel=\"nofollow\">mention</a> \uD801\uDC00 <a href=\"http://twitter.com\" rel=\"nofollow\">http://twitter.com</a>",
      "Autolink hashtag/mentionURL w/ Supplementary character");

  // handle the @ character in the URL
  var testUrl = "http://twitter.com?var=@val";
  deepEqual(twttr.txt.autoLink(testUrl),  "<a href=\"" + testUrl + "\" rel=\"nofollow\">" + testUrl + "</a>", "Autolink with special char params");
  // handle the @ character in the URL and an @mention at the deepEqual time
  deepEqual(twttr.txt.autoLink(testUrl + " @mention"),  "<a href=\"" + testUrl + "\" rel=\"nofollow\">" + testUrl + "</a> @<a class=\"tweet-url username\" href=\"https://twitter.com/mention\" data-screen-name=\"mention\" rel=\"nofollow\">mention</a>", "Autolink with special char params and mentions");
});

test("twttr.txt.linkTextWithEntity", function() {
  var result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "twitter.com",
    "expanded_url": "http://twitter.com/"},
    {invisibleTagAttrs: "class='invisible'"});
  deepEqual(result,
      "<span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span><span class='invisible'>http://</span><span class='js-display-url'>twitter.com</span><span class='invisible'>/</span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span>",
      "Entire display_url is in expanded_url");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "twitter.com…",
    "expanded_url": "http://twitter.com/abcdefg"},
    {invisibleTagAttrs: "class='invisible'"});
  deepEqual(result,
      "<span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span><span class='invisible'>http://</span><span class='js-display-url'>twitter.com</span><span class='invisible'>/abcdefg</span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span>…</span>",
      "display_url ends with …");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "…tter.com/abcdefg",
    "expanded_url": "http://twitter.com/abcdefg"},
    {invisibleTagAttrs: "class='invisible'"});
  deepEqual(result,
      "<span class='tco-ellipsis'>…<span class='invisible'>&nbsp;</span></span><span class='invisible'>http://twi</span><span class='js-display-url'>tter.com/abcdefg</span><span class='invisible'></span><span class='tco-ellipsis'><span class='invisible'>&nbsp;</span></span>",
      "display_url begins with …");

  result = twttr.txt.linkTextWithEntity({
    "url": "http://t.co/abcde",
    "display_url": "pic.twitter.com/xyz",
    "expanded_url": "http://twitter.com/foo/statuses/123/photo/1"},
    {invisibleTagAttrs: "class='invisible'"});
  deepEqual(result,
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

test("twttr.txt.extractUrls", function() {
  var message_with_hyphenated_url = "Message with hyphenated-url.com";
  var message_with_www_hyphenated_url = "Message with www.123-hyphenated-url.com";
  equal(twttr.txt.extractUrls(message_with_hyphenated_url)[0], "hyphenated-url.com", "Should extract full url with hyphen.");
  equal(twttr.txt.extractUrls(message_with_www_hyphenated_url)[0], "www.123-hyphenated-url.com", "Should extract full url with hyphen.");
});

test("twttr.txt.parseTweet", function() {
  var configVersion1 = twttr.txt.configs.version1;
  var configVersion2 = twttr.txt.configs.version2;
  var longTweet = "280 chars-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-xxxxxx"
  deepEqual(twttr.txt.parseTweet(longTweet, configVersion1), {
    weightedLength: 280,
    valid: false,
    permillage: 2000,
    displayRangeStart: 0,
    displayRangeEnd: 279,
    validRangeStart: 0,
    validRangeEnd: 139
  }, 'parse long latin tweet with old config is invalid');

  deepEqual(twttr.txt.parseTweet(longTweet, configVersion2), {
    weightedLength: 280,
    valid: true,
    permillage: 1000,
    displayRangeStart: 0,
    displayRangeEnd: 279,
    validRangeStart: 0,
    validRangeEnd: 279
  }, 'parse long latin tweet is valid');

  var cjkEmojiTweet = "你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想到你想到多多多多你想👩‍👩‍👧‍👦";
  deepEqual(twttr.txt.parseTweet(cjkEmojiTweet, configVersion2), {
    weightedLength: 289,
    valid: false,
    permillage: 1032,
    displayRangeStart: 0,
    displayRangeEnd: 149,
    validRangeStart: 0,
    validRangeEnd: 140
  }, 'parse a cjk tweet with an emoji at the end is invalid');

  var familyEmojiTweet = "👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦";
  deepEqual(twttr.txt.parseTweet(familyEmojiTweet, configVersion2), {
    weightedLength: 220,
    valid: true,
    permillage: 785,
    displayRangeStart: 0,
    displayRangeEnd: 219,
    validRangeStart: 0,
    validRangeEnd: 219
  }, 'parse a valid tweet with 20 family emojis');

  deepEqual(twttr.txt.parseTweet('', configVersion2), {
    weightedLength: 0,
    valid: false,
    permillage: 0,
    displayRangeStart: 0,
    displayRangeEnd: 0,
    validRangeStart: 0,
    validRangeEnd: 0
  }, 'empty tweet should be invalid');

  deepEqual(twttr.txt.parseTweet('1⃣'), {
    displayRangeEnd: 1,
    displayRangeStart: 0,
    permillage: 7,
    valid: true,
    validRangeEnd: 1,
    validRangeStart: 0,
    weightedLength: 2
  });
});

test("twttr.txt.standardizeIndices", function() {
  // properly adjusts indices when UTF-8 length and UTF-16 visible text length differ
  // - for text with an emoji before the indices
  deepEqual(twttr.txt.standardizeIndices('@foo 🐥 This text has an emoji here', 6, 34), [7, 35]);

  // - for text with an emoji within the indices
  deepEqual(twttr.txt.standardizeIndices('@foo This text has an emoji 🐥 here', 5, 34), [5, 35]);

  // - for text with an emoji after the indices
  deepEqual(twttr.txt.standardizeIndices('@foo This text has an emoji here 🐥', 5, 34), [5, 35]);

  // - for text with emojis and non-standard characters within and outside of indices
  deepEqual(twttr.txt.standardizeIndices('@foo This text has an emoji here 🐥 and also outside here: 🐥 🐥 🐥', 5, 34), [5, 35]);

  // - for text with no emojis, but non-standard characters after indices
  deepEqual(twttr.txt.standardizeIndices('@foo This text has no emoji here 🐥<-- except outside', 5, 33), [5, 33]);

  // does not modify indices when UTF-8 length and UTF-16 text length are the same
  deepEqual(twttr.txt.standardizeIndices('@foo This text has no emoji here', 5, 33), [5, 33]);
});
