# Copyright 2018 Twitter, Inc.
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

# encoding: utf-8

Gem::Specification.new do |s|
  s.name = "twitter-text"
  s.version = "3.1.0"
  s.authors = ["David LaMacchia", "Sudheer Guntupalli", "Kaushik Lakshmikanth", "Jose Antonio Marquez Russo", "Lee Adams",
               "Yoshimasa Niwa"]
  s.email = ["opensource@twitter.com"]
  s.homepage = "http://twitter.com"
  s.description = s.summary = "A gem that provides text handling for Twitter"
  s.license = "Apache 2.0"

  s.platform = Gem::Platform::RUBY
  s.summary = "Twitter text handling library"

  s.add_development_dependency "test-unit"
  s.add_development_dependency "multi_json", "~> 1.3"
  s.add_development_dependency "nokogiri", "~> 1.10.9"
  s.add_development_dependency "rake"
  s.add_development_dependency "rdoc"
  s.add_development_dependency "rspec", "~> 3.0"
  s.add_development_dependency "simplecov"
  s.add_runtime_dependency     "unf", "~> 0.1.0"
  # Use of idn-ruby requires libidn to be installed separately
  s.add_runtime_dependency     "idn-ruby"

  s.files         = `git ls-files`.split("\n") + ['lib/assets/tld_lib.yml'] + Dir['config/*']
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
