# twitter-text-js

A JavaScript utility that provides text processing routines for Tweets.  This library conforms to a common test suite shared by many other implementations, particularly twitter-text.gem (Ruby).  The library provides autolinking and extraction for URLs, usernames, lists, and hashtags.

## NPM Users

Install it with: `npm install twitter-text`

The `twttr.txt` namespace is exported, making it available as such:

``` js
var twitter = require('twitter-text')
twitter.autoLink(twitter.htmlEscape('#hello < @world >'))
```

## Extraction Examples

    // basic extraction
    var usernames = twttr.txt.extract_mentioned_screen_names("Mentioning @twitter and @jack")
    // usernames == ["twitter", "jack"]

## Auto-linking Examples

    twttr.txt.autoLink("link @user, please #request");

## Usernames

Username extraction and linking matches all valid Twitter usernames but does
not verify that the username is a valid Twitter account.

## Lists

Auto-link and extract list names when they are written in @user/list-name
format.

## Hashtags

Auto-link and extract hashtags, where a hashtag contains any latin letter or
number but cannot be solely numbers.

## URLs

Auto-linking and extraction of URLs differs from some other linkification libraries so that they
will work correctly in Tweets written in languages that do not include spaces
between words.

## International

Special care has been taken to be sure that auto-linking and extraction work
in Tweets of all languages. This means that languages without spaces between
words should work equally well.

## Hit Highlighting

Use to provide emphasis around the "hits" returned from the Search API, built
to work against text that has been auto-linked already.

## Testing

### Conformance

The main test suite is twitter-text-conformance.  This is set up as a git submodule that is automatically updated at each run.  Tests are run in your browser, using QUnit.  To run the conformance suite, from the project root, run:

    rake test:conformance

Your default browser will open the test suite.  You should open the test suite in your other browsers as you see fit.

### Other Tests

There are a few tests specific to twitter-text-js that are not part of the conformance suite.  To run these, from the project root, run:

    rake test

Your default browser will open the test suite.

## Packaging

Official versions are kept in the `pkg/` directory.  To roll a new version, (ex. v1.1.0), run the following from project root:

    rake package[1.1.0]

This will make a new file at `pkg/twitter-text-1.1.0.js`.

## Reporting Bugs

Please direct bug reports to the [twitter-text-js issue tracker on GitHub](http://github.com/bcherry/twitter-text-js/issues)

## Copyright and License

Copyright 2011 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.