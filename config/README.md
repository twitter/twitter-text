# twitter-text Configuration

twitter-text 2.0 introduces a new configuration format as well as APIs
for interpreting this configuration. The configuration is a JSON
string (or file) and the parsing APIs have been provided in each of
twitter-text’s four reference languages.

## Format

The configuration format is a JSON string. The JSON can have the following properties:

* `version` (required, integer, min value 0)
* `maxWeightedTweetLength` (required, integer, min value 0)
* `scale` (required, integer, min value 1)
* `defaultWeight` (required, integer, min value 0)
* `emojiParsingEnabled` (optional, boolean)
* `transformedURLLength` (integer, min value 0)
* `ranges` (array of range items)

A `range item` has the following properties:

* `start` (required, integer, min value 0)
* `end` (required, integer, min value 0)
* `weight` (required, integer, min value 0)

## Parameters

### version

The version for the configuration string. This is an integer that will
monotonically increase in future releases. The legacy version of the
string is version 1; weighted code point ranges and 280-character
“long” tweets are supported in version 2.

### maxWeightedTweetLength

The maximum length of the tweet, weighted. Legacy v1 tweets had a
maximum weighted length of 140 and all characters were weighted the
same. In the new configuration format, this is represented as a
maxWeightedTweetLength of 140 and a defaultWeight of 1 for all code
points.

### scale

The Tweet length is the (`weighted length` / `scale`).

### defaultWeight

The default weight applied to all code points. This is overridden in
one or more range items.

### emojiParsingEnabled

When set to true, the weighted Tweet length considers all emoji as a
single code point (with a default weight of 200), including longer
grapheme clusters combined by zero-width joiners. When set to false,
Tweet length is calculated by weighing individual Unicode code points.

### transformedURLLength

The length counted for URLs against the total weight of the Tweet. In
previous versions of twitter-text, which was the “shortened URL
length.” Differentiating between the http and https shortened length
for URLs has been deprecated (https is used for all t.co URLs). The
default value is 23.

### ranges

An array of range items that describe ranges of Unicode code points
and the weight to apply to each code point. Each range is defined by
its start, end, and weight. Surrogate pairs have a length that is
equivalent to the length of the first code unit in the surrogate
pair. Note that certain graphemes are the result of joining code
points together, such as by a zero-width joiner; unlike a surrogate
pair, the length of such a grapheme will be the sum of the weighted
length of all included code points.

## API

Each of the four reference language implementations provides a way to
read the JSON configuration.

## Java

```java
public static TwitterTextConfiguration configurationFromJson(@Nonnull String json, boolean isResource)
```

`json`: the configuration string or file name in the config directory (see `isResource`)
`isResource`: if true, json refers to a file name for the configuration.

## JavaScript

Configurations are accessed via `twttr.text.configs` (example:
`twttr.text.configs.version2`). This config is passed as an argument
to `parseTweet:`

```js
twttr.txt.parseTweet(inputText, configVersion2)
```

## Objective-C

The Objective-C implementation provides two methods for reading the
input, either from a string or a file resource.

```objective-c
+ (instancetype)configurationFromJSONResource:(NSString *)jsonResource;
+ (instancetype)configurationFromJSONString:(NSString *)jsonString;
```

The default configuration can also be set:

```objective-c
+ (void)setDefaultParserConfiguration:(TwitterTextConfiguration *)configuration
```

The resource string refers to the two included configuration files
(which are referenced in the Xcode project).

## Ruby

Ruby provides the `Twitter::Configuration` class and means to read
from a file or string.

```ruby
def self.parse_string(string, options = {})
def self.parse_file(filename)
```

You can use `configuration_from_file()` or initialize a configuration
using `Twitter::Configuration.new(config)`, where `config` is the
output of one of the two above methods.









