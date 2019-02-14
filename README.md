twitter-text in Rust
============

This repo is a Rust implementation of twitter-text. All aspects of tweet text are parsed by a [Pest](https://github.com/pest-parser/pest) [PEG](https://en.wikipedia.org/wiki/Parsing_expression_grammar) grammar, with the exception of URL length and character weighting. See the [parser](parser/src) directory for the grammar. Procedural validation for URL lengths and  charachter weights is performed by the [Extractor](twitter_text/src/extractor.rs) code.

The original Twitter README content is below.

twitter-text
============

This repo is a collection of libraries and conformance tests to standardize parsing of Tweet text. It synchronizes development, testing, creating issues, and pull requests for twitter-text's implementations and specification. These libraries are responsible for determining the quantity of characters in a Tweet and identifying and linking any url, @username, #hashtag, or $cashtag.

See implementations and conformance in this repo below:

* [Conformance](conformance)
* [Java](java)
* [Ruby](rb)
* [JavaScript](js)
* [Objective-C](objc)

## Copyright and License

Copyright 2012-2018 Twitter, Inc and other contributors

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
