# encoding: utf-8

Gem::Specification.new do |s|
  s.name = "twitter-text"
  s.version = "1.5.0"
  s.authors = ["Matt Sanford", "Patrick Ewing", "Ben Cherry", "Britt Selvitelle",
               "Raffi Krikorian", "J.P. Cummins", "Yoshimasa Niwa", "Keita Fujii"]
  s.email = ["matt@twitter.com", "patrick.henry.ewing@gmail.com", "bcherry@gmail.com", "bs@brittspace.com",
             "raffi@twitter.com", "jcummins@twitter.com", "niw@niw.at", "keita@twitter.com"]
  s.homepage = "http://twitter.com"
  s.description = s.summary = "A gem that provides text handling for Twitter"

  s.platform = Gem::Platform::RUBY
  s.has_rdoc = true
  s.summary = "Twitter text handling library"

  s.add_development_dependency "nokogiri"
  s.add_development_dependency "rake"
  s.add_development_dependency "rdoc"
  s.add_development_dependency "rspec"
  s.add_development_dependency "simplecov"
  s.add_runtime_dependency "activesupport"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
