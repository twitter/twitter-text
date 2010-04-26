raise("twitter-text requires the $KCODE variable be set to 'UTF8' or 'u'") unless ['u','UTF8'].include?($KCODE)

require 'rubygems'

# Needed for auto-linking
require 'action_view'

require File.join(File.dirname(__FILE__), 'regex')
require File.join(File.dirname(__FILE__), 'autolink')
require File.join(File.dirname(__FILE__), 'extractor')
require File.join(File.dirname(__FILE__), 'unicode')
require File.join(File.dirname(__FILE__), 'validation')
require File.join(File.dirname(__FILE__), 'hithighlighter')
