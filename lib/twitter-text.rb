major, minor, patch = RUBY_VERSION.split('.')

$RUBY_1_9 = if major.to_i == 1 && minor.to_i < 9
  # Ruby 1.8 KCODE check. Not needed on 1.9 and later.
  raise("twitter-text requires the $KCODE variable be set to 'UTF8' or 'u'") unless $KCODE[0].chr =~ /u/i
  false
else
  true
end

require 'active_support'
require 'active_support/core_ext/string/multibyte.rb'
require 'active_support/core_ext/hash/keys.rb'

%w(
  deprecation
  regex
  rewriter
  autolink
  extractor
  unicode
  validation
  hit_highlighter
).each do |name|
  require "twitter-text/#{name}"
end
