
raise("twitter-text requires the $KCODE variable be set to 'UTF8'") unless $KCODE == 'UTF8'

require 'rubygems'

# Needed for auto-linking
require 'action_view'

require 'regex'
require 'autolink'
require 'extractor'
require 'unicode'
require 'validation'