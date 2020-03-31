# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

Pod::Spec.new do |s|
  name = "twitter-text"
  version = "3.1.0"
  url = "https://github.com/twitter/#{name}"
  git_url = "#{url}.git"
  tag = "v#{version}"

  s.name = name
  s.version = version
  s.license = { :type => "Apache License, Version 2.0" }
  s.summary = "Objective-C port of the twitter-text handling libraries."
  s.description      = <<-DESC
  Twitter text is a library responsible for:
    Determining the quantity of characters in a tweet
    Identifying and linking any url, @username, #hashtag, or $cashtag entities
                       DESC
  s.homepage = "#{url}/tree/#{tag}/objc"

  s.source = { :git => "#{url}.git", :tag => tag }
  s.source_files = 'objc/lib/*.{h,m}', 'objc/ThirdParty/IFUnicodeURL/IFUnicodeURL/*.{h,m}', 'objc/ThirdParty/IFUnicodeURL/IFUnicodeURL/IDNSDK/**/*.{h,m,c}'
  s.public_header_files = 'objc/lib/TwitterText.h', 'objc/lib/TwitterTextEntity.h'
  s.header_mappings_dir = 'objc'
  s.resources = 'config/v*.json'

  s.author = { "Twitter, Inc." => "opensource@twitter.com" }
  s.ios.deployment_target = "9.0"
  s.osx.deployment_target = "10.12"
end
