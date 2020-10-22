# twitter-text

![](https://img.shields.io/cocoapods/v/twitter-text.svg)

This is the Objective-C implementation of the twitter-text parsing
library. The library has methods to parse Tweets and calculate length,
validity, parse @mentions, #hashtags, URLs, and more.

This library supports OS X 10.11+ and iOS 9+.

## Setup

Make sure Xcode 9+ is already installed.

Run the following command to setup xcodebuild on the command line:

```
% sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer
```

## Conformance tests

To run the Conformance test suite from the command line via rake:

```
% rake test:conformance:run
```

You can also run the tests from within Xcode itself. Open the project
file and run the tests are you normally would (Cmd-U).

If you need to, you can convert the yml tests that are shared with the
other language implementations to json via the following:

```
% rake test:conformance:convert_tests
```

## API

twitter-text 2.0 introduces configuration files that define how Tweets
are parsed for length. This allows for backwards compatibility and
flexibility going forward. Old-style traditional 140-character parsing
is defined by the v1.json configuration file, whereas v2.json is
updated for "weighted" Tweets where ranges of Unicode code points can
have independent weights aside from the default weight. The sum of all
code points, each weighted appropriately, should not exceed the max
weighted length.

Some old methods from twitter-text 1.0 have been marked deprecated,
such as the various `+tweetLength:` methods. The new API is based on the
following method, `-parseTweet:`

```
- (TwitterTextParseResults *)parseTweet:(NSString *)text
```

This method takes a string as input and returns a results object that
contains information about the string. `TwitterTextParseResults`
includes:

* `(NSInteger)weightedLength`: the overall length of the Tweet with code points
weighted per the ranges defined in the configuration file.

* `(NSInteger)permillage`: indicates the proportion (per thousand) of the weighted
length in comparison to the max weighted length. A value > 1000
indicates input text that is longer than the allowable maximum.

* `(BOOL)isValid`: indicates if input text length corresponds to a valid
result.

* `(NSRange)displayTextRange`: An array of two unicode code point
indices identifying the inclusive start and exclusive end of the
displayable content of the Tweet.

* `(NSRange)validDisplayTextRange`: An array of two unicode code point
indices identifying the inclusive start and exclusive end of the valid
content of the Tweet.

## Issues

Have a bug? Please create an issue here on GitHub!

<https://github.com/twitter/twitter-text/issues>

## Authors

* Satoshi Nakagawa (<https://github.com/psychs>)
* David LaMacchia (<https://github.com/dlamacchia>)
* Keh-Li Sheng (<https://github.com/kehli>)

## License

Copyright 2012-2020 Twitter, Inc and other contributors

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
