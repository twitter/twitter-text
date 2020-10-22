
[![Maven Central](https://img.shields.io/maven-central/v/com.twitter.twittertext/twitter-text.svg)](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.twitter.twittertext%22%20AND%20a%3A%22twitter-text%22)

# twitter-text

This is the Java implementation of the twitter-text parsing library. The library has methods and classes to parse Tweets and calculate length, validity, parse @mentions, #hashtags, URLs, and more.

## Getting Started

The latest artifacts are published to Maven Central.

Bringing twitter-text-java into your project should be as simple as adding the following to your pom.xml:

```xml
  <dependencies>
    <dependency>
      <groupId>com.twitter.twittertext</groupId>
      <artifactId>twitter-text</artifactId>
      <version>3.1.0</version> <!-- or whatever the latest version is -->
    </dependency>
  </dependencies>
```

## Building

To build, run maven:

`% mvn clean install`

## Conformance and Unit Tests

To run tests:

`% mvn test`

## Javadocs

To generate Javadocs, run this under src/main/java:

`% javadoc -d ../../../docs/api/ com.twitter.twittertext`

## API
twitter-text 3.0 updates the config file with emojiParsingEnabled config option. When true, twitter-text will parse and discount emoji supported by the twemoji library (see https://github.com/twitter/twemoji). The length of these emoji will be the default weight (200 or two characters) even if they contain multiple code points combined by zero-width joiners. This means that emoji with skin tone and gender modifiers no longer count as more characters than those without such modifiers.

twitter-text 2.0 introduced configuration files that define how Tweets are parsed for length. This allows for backwards compatibility and flexibility going forward. Old-style traditional 140-character parsing is defined by the v1.json configuration file, whereas v2.json is updated for "weighted" Tweets where ranges of Unicode code points can have independent weights aside from the default weight. The sum of all code points, each weighted appropriately, should not exceed the max weighted length.

`static TwitterTextParseResults TwitterTextParser.parseTweet(String text)`

This method takes a string as input and returns a results object that contains information about the string. `TwitterTextParseResults` includes:

* `public final int weightedLength`: the overall length of the Tweet with code points weighted per the ranges defined in the configuration file.

* `public final int permillage`: indicates the proportion (per thousand) of the weighted length in comparison to the max weighted length. A value > 1000 indicates input text that is longer than the allowable maximum.

* `public final boolean isValid`: indicates if input text length corresponds to a valid result.

* `public final Range displayTextRange`: A pair of unicode code point indices identifying the inclusive start and exclusive end of the displayable content of the Tweet.

* `public final Range validDisplayTextRange`: A pair of unicode code point indices identifying the inclusive start and exclusive end of the valid content of the Tweet.

## Tweet Length Examples

    final TwitterTextParseResults result = TwitterTextParser.parseTweet("We're expanding the character limit! We want it to be easier and faster for everyone to express themselves.\n\nMore characters. More expression. More of what's happening.\nhttps://cards.twitter.com/cards/gsby/4ztbu");
    // result.weightedLength == 192
    // result.permillage == 685
    // result.isValid == true
    // result.displayTextRange == 0-210
    // result.validTextRange == 0-210

## Extraction Examples

    final Extractor extractor = new Extractor();
    final List<String> urls = extractor.extractURLs("We're expanding the character limit! We want it to be easier and faster for everyone to express themselves.\n\nMore characters. More expression. More of what's happening.\nhttps://cards.twitter.com/cards/gsby/4ztbu")
    // urls == ["https://cards.twitter.com/cards/gsby/4ztbu"]

## Auto-linking Examples

    final Autolink autolinker = new Autolink();
    final String linkedText = autolinker.autoLink("@twitter #lovetwitter $TWTR");
    // linkedText == "@<a class="tweet-url username" href="https://twitter.com/twitter" rel="nofollow">twitter</a> <a href="https://twitter.com/search?q=%23lovetwitter" title="#lovetwitter" class="tweet-url hashtag" rel="nofollow">#lovetwitter</a> <a href="https://twitter.com/search?q=%24TWTR" title="$TWTR" class="tweet-url cashtag" rel="nofollow">$TWTR</a>"

## Issues

Have a bug? Please create an issue here on GitHub!

https://github.com/twitter/twitter-text/issues

## License

Copyright 2011-2020 Twitter, Inc. and other contributors

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
