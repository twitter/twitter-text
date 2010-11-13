spec = Gem::Specification.new do |s|
  s.name = "twitter-text"
  s.version = "1.2.4"
  s.authors = ["Matt Sanford", "Patrick Ewing", "Ben Cherry", "Britt Selvitelle", "Raffi Krikorian"]
  s.email = ["matt@twitter.com", "patrick.henry.ewing@gmail.com", "bcherry@gmail.com", "bs@brittspace.com", "raffi@twitter.com"]
  s.homepage = "http://twitter.com"
  s.description = s.summary = "A gem that provides text handling for Twitter"

  s.platform = Gem::Platform::RUBY
  s.has_rdoc = true
  s.summary = "Twitter text handling library"

  s.add_development_dependency "hpricot"
  s.add_development_dependency "rake"
  s.add_development_dependency "rcov"
  s.add_development_dependency "rspec"
  s.add_runtime_dependency "actionpack"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
