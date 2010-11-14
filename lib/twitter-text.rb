major, minor, patch = RUBY_VERSION.split('.')

if major.to_i == 1 && minor.to_i < 9
  # Ruby 1.8 KCODE check. Not needed on 1.9 and later.
  raise("twitter-text requires the $KCODE variable be set to 'UTF8' or 'u'") unless $KCODE[0].chr =~ /u/i
end

require 'action_pack'
require 'action_view'

require File.join(File.dirname(__FILE__), 'regex')
require File.join(File.dirname(__FILE__), 'autolink')
require File.join(File.dirname(__FILE__), 'extractor')
require File.join(File.dirname(__FILE__), 'unicode')
require File.join(File.dirname(__FILE__), 'validation')
require File.join(File.dirname(__FILE__), 'hithighlighter')
