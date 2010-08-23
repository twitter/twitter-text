require 'rubygems' unless ENV['NO_RUBYGEMS']
require 'rake/gempackagetask'
require 'rake/rdoctask'
require 'rubygems/specification'
require 'date'

gem 'rspec'
require 'spec/rake/spectask'
require 'spec/rake/verify_rcov'
require 'digest'

spec = Gem::Specification.new do |s|
  s.name = "twitter-text"
  s.version = "1.1.8"
  s.authors = ["Matt Sanford", "Patrick Ewing", "Ben Cherry", "Britt Selvitelle", "Raffi Krikorian"]
  s.email = ["matt@twitter.com", "patrick.henry.ewing@gmail.com", "bcherry@gmail.com", "bs@brittspace.com", "raffi@twitter.com"]
  s.homepage = "http://twitter.com"
  s.description = s.summary = "A gem that provides text handling for Twitter"

  s.platform = Gem::Platform::RUBY
  s.has_rdoc = true
  s.summary = "Twitter text handling library"

  s.add_dependency "actionpack"

  s.require_path = 'lib'
  s.autorequire = ''
  s.files = %w(LICENSE README.rdoc Rakefile TODO) + Dir.glob("{lib,spec}/**/*")
end

task :default => :spec

desc "Run specs"
Spec::Rake::SpecTask.new do |t|
  t.spec_files = FileList['spec/**/*_spec.rb']
  t.spec_opts = %w(-fs --color)
  t.libs << ["spec", '.']
end

desc "Run all examples with RCov"
Spec::Rake::SpecTask.new('spec:rcov') do |t|
  t.spec_files = FileList['spec/**/*.rb']
  t.rcov = true
  t.rcov_opts = ['--exclude', 'spec']
end

def conformance_version(dir)
  Dir[File.join(dir, '*')].inject(Digest::SHA1.new){|digest, file| digest.update(Digest::SHA1.file(file).hexdigest) }
end

namespace :test do
  namespace :conformance do
    desc "Update conformance testing data"
    task :update do
      puts "Updating conformance data ... "
      system("git submodule init") || raise("Failed to init submodule")
      system("git submodule update") || raise("Failed to update submodule")
      puts "Updating conformance data ... DONE"
    end

    desc "Change conformance test data to the lastest version"
    task :latest => ['conformance:update'] do
      current_dir = File.dirname(__FILE__)
      submodule_dir = File.join(File.dirname(__FILE__), "test", "twitter-text-conformance")
      version_before = conformance_version(submodule_dir)
      system("cd #{submodule_dir} && git pull origin master") || raise("Failed to pull submodule version")
      system("cd #{current_dir}")
      if conformance_version(submodule_dir) != version_before
        system("cd #{current_dir} && git add #{submodule_dir}") || raise("Failed to add upgrade files")
        system("git commit -m \"Upgraded to the latest conformance suite\" #{submodule_dir}") || raise("Failed to commit upgraded conformacne data")
        puts "Upgraded conformance suite."
      else
        puts "No conformance suite changes."
      end
    end

    desc "Run conformance test suite"
    task :run do
      ruby "test/conformance_test.rb"
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:latest', 'conformance:run'] do
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
