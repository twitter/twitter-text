# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

major, minor, _patch = RUBY_VERSION.split('.')

$RUBY_1_9 = if major.to_i == 1 && minor.to_i < 9
  # Ruby 1.8 KCODE check. Not needed on 1.9 and later.
  raise("twitter-text requires the $KCODE variable be set to 'UTF8' or 'u'") unless $KCODE[0].chr =~ /u/i
  false
else
  true
end

%w(
  deprecation
  emoji_regex
  regex
  rewriter
  autolink
  extractor
  unicode
  weighted_range
  configuration
  validation
  hit_highlighter
).each do |name|
  require "twitter-text/#{name}"
end
