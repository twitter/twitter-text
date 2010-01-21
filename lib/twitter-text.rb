
raise("twitter-text requires the $KCODE variable be set to 'UTF8'") unless $KCODE == 'UTF8'

require 'rubygems'

# Needed for auto-linking
require 'action_view'

require File.dirname(__FILE__) + '/regex'
require File.dirname(__FILE__) + '/autolink'
require File.dirname(__FILE__) + '/extractor'
require File.dirname(__FILE__) + '/unicode'
require File.dirname(__FILE__) + '/validation'