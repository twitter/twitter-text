Pod::Spec.new do |s|
  name = "twitter-text"
  version = "1.12.0"
  url = "https://github.com/twitter/#{name}"
  git_url = "#{url}.git"
  tag = "v#{version}"

  s.name = name
  s.version = version
  s.license = { :type => "Apache License, Version 2.0" }
  s.summary = "Objective-C port of the twitter-text handling libraries."
  s.homepage = "#{url}/tree/#{tag}/objc"
  s.source = { :git => "#{url}.git", :tag => tag }
  s.source_files = "objc/lib/**/*.{h,m}"
  s.author = { "Twitter, Inc." => "opensource@twitter.com" }
  s.ios.deployment_target = "4.0"
  s.osx.deployment_target = "10.7"
end
