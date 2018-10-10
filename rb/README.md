# twitter-text

![](https://img.shields.io/gem/v/twitter-text.svg)

This is the Ruby implementation of the twitter-text parsing
library. The library has methods to parse Tweets and calculate length,
validity, parse @mentions, #hashtags, URLs, and more.

## Setup

Installation uses bundler.

```
% gem install bundler
% bundle install
```

## Conformance tests

To run the Conformance test suite from the command line via rake:

```
% rake test:conformance:run
```

You can also run the rspec tests in the `spec` directory:

```
% rspec spec
```

# Length validation

twitter-text 2.0 introduces configuration files that define how Tweets
are parsed for length. This allows for backwards compatibility and
flexibility going forward. Old-style traditional 140-character parsing
is defined by the v1.json configuration file, whereas v2.json is
updated for "weighted" Tweets where ranges of Unicode code points can
have independent weights aside from the default weight. The sum of all
code points, each weighted appropriately, should not exceed the max
weighted length.

Some old methods from twitter-text 1.0 have been marked deprecated,
such as the `tweet_length()` method. The new API is based on the
following method, `parse_tweet()`

```ruby
def parse_tweet(text, options = {}) { ... }
```

This method takes a string as input and returns a results object that
contains information about the
string. `Twitter::TwitterText::Validation::ParseResults` object includes:

* `:weighted_length`: the overall length of the tweet with code points
weighted per the ranges defined in the configuration file.

* `:permillage`: indicates the proportion (per thousand) of the weighted
length in comparison to the max weighted length. A value > 1000
indicates input text that is longer than the allowable maximum.

* `:valid`: indicates if input text length corresponds to a valid
result.

* `:display_range_start, :display_range_end`: An array of two unicode code point
indices identifying the inclusive start and exclusive end of the
displayable content of the Tweet. For more information, see
the description of `display_text_range` here:
[Tweet updates](https://developer.twitter.com/en/docs/tweets/tweet-updates)

* `:valid_range_start, :valid_range_end`: An array of two unicode code point
indices identifying the inclusive start and exclusive end of the valid
content of the Tweet. For more information on the extended Tweet
payload see [Tweet updates](https://developer.twitter.com/en/docs/tweets/tweet-updates)

## Extraction Examples

# Extraction
```ruby
class MyClass
  include Twitter::TwitterText::Extractor
  usernames = extract_mentioned_screen_names("Mentioning @twitter and @jack")
  # usernames = ["twitter", "jack"]
end
```

### Extraction with a block argument

```ruby
class MyClass
  include Twitter::TwitterText::Extractor
  extract_reply_screen_name("@twitter are you hiring?").do |username|
    # username = "twitter"
  end
end
```

## Auto-linking Examples

### Auto-link

```ruby
class MyClass
  include Twitter::TwitterText::Autolink

  html = auto_link("link @user, please #request")
end
```

### For Ruby on Rails you want to add this to app/helpers/application_helper.rb
```ruby
module ApplicationHelper
  include Twitter::TwitterText::Autolink
end
```

### Now the auto_link function is available in every view. So in index.html.erb:
```ruby
<%= auto_link("link @user, please #request") %>
```

### Usernames

Username extraction and linking matches all valid Twitter usernames but does
not verify that the username is a valid Twitter account.

### Lists

Auto-link and extract list names when they are written in @user/list-name
format.

### Hashtags

Auto-link and extract hashtags, where a hashtag can contain most letters or
numbers but cannot be solely numbers and cannot contain punctuation.

### URLs

Asian languages like Chinese, Japanese or Korean may not use a delimiter such
as a space to separate normal text from URLs making it difficult to identify
where the URL ends and the text starts.

For this reason twitter-text currently does not support extracting or
auto-linking of URLs immediately followed by non-Latin characters.

Example: "http://twitter.com/は素晴らしい" . The normal text is "は素晴らしい" and is not
part of the URL even though it isn't space separated.

### International

Special care has been taken to be sure that auto-linking and extraction work
in Tweets of all languages. This means that languages without spaces between
words should work equally well.

### Hit Highlighting

Use to provide emphasis around the "hits" returned from the Search API, built
to work against text that has been auto-linked already.

## Issues

Have a bug? Please create an issue here on GitHub!

<https://github.com/twitter/twitter-text/issues>

## Authors

### V2.0

* David LaMacchia (<https://github.com/dlamacchia>)
* Yoshimasa Niwa (<https://github.com/niw>)
* Sudheer Guntupalli (<https://github.com/sudhee>)
* Kaushik Lakshmikanth (<https://github.com/kaushlakers>)
* Jose Antonio Marquez Russo (<https://github.com/joseeight>)
* Lee Adams (<https://github.com/leeaustinadams>)

### Previous authors

* Matt Sanford (<http://github.com/mzsanford>)
* Raffi Krikorian (<http://github.com/r>)
* Ben Cherry (<http://github.com/bcherry>)
* Patrick Ewing (<http://github.com/hoverbird>)
* Jeff Smick (<http://github.com/sprsquish>)
* Kenneth Kufluk (<https://github.com/kennethkufluk>)
* Keita Fujii (<https://github.com/keitaf>)
* Jean-Philippe Bougie (<http://github.com/jpbougie>)
* Erik Michaels-Ober (<https://github.com/sferik>)

## License

Copyright 2012-2018 Twitter, Inc and other contributors

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
