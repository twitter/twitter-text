require 'rubygems' unless ENV['NO_RUBYGEMS']
require 'rake/gempackagetask'
require 'rake/rdoctask'
require 'rubygems/specification'
require 'date'
require 'spec/rake/spectask'
require 'spec/rake/verify_rcov'


spec = Gem::Specification.new do |s|
  s.name = "twitter-text"
  s.version = "1.0"
  s.author = "Matt Sanford"
  s.email = "matt@twitter.com"
  s.homepage = "http://twitter.com"
  s.description = s.summary = "A gem that provides text handling for Twitter"

  s.platform = Gem::Platform::RUBY
  s.has_rdoc = true
  s.summary = "Twitter text handling library"

  s.add_dependency "action_view"

  s.require_path = 'lib'
  s.autorequire = ''
  s.files = %w(LICENSE README.rdoc Rakefile TODO) + Dir.glob("{lib,spec}/**/*")
end

task :default => :spec

desc "Run specs"
Spec::Rake::SpecTask.new do |t|
  t.spec_files = FileList['spec/**/*_spec.rb']
  t.spec_opts = %w(-fs --color)
end

desc "Run all examples with RCov"
Spec::Rake::SpecTask.new('spec:rcov') do |t|
  t.spec_files = FileList['spec/**/*.rb']
  t.rcov = true
  t.rcov_opts = ['--exclude', 'spec']
end

namespace :test do
  namespace :conformance do
    desc "Update conformance testing data"
    task :update do
      dir = File.join(File.dirname(__FILE__), "test", "twitter-text-conformance")
      puts "Updating conformance data ... "
      system("cd #{dir} && git pull origin master") || exit(1)
      puts "Updating conformance data ... DONE"
    end

    desc "Run conformance test suite"
    task :run do
      ruby "test/conformance_test.rb"
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:update', 'conformance:run'] do
  end
end


namespace :doc do 
  Rake::RDocTask.new do |rd|
    rd.main = "README.rdoc"
    rd.rdoc_dir = 'doc'
    rd.rdoc_files.include("README.rdoc", "lib/**/*.rb")
  end
end

Rake::GemPackageTask.new(spec) do |pkg|
  pkg.gem_spec = spec
end

desc "install the gem locally"
task :install => [:package] do
  sh %{sudo gem install pkg/#{GEM}-#{GEM_VERSION}}
end

desc "create a gemspec file"
task :make_spec do
  File.open("#{GEM}.gemspec", "w") do |file|
    file.puts spec.to_ruby
  end
end

desc "runs cruise control build"
task :cruise => [:spec, 'test:conformance'] do
end
