require 'bundler'
include Rake::DSL
Bundler::GemHelper.install_tasks

task :build => ['prebuild']
task :spec => ['prebuild']
task :default => ['prebuild', 'spec', 'test:conformance']
task :test => :spec

directory "config"
directory "lib/assets"

desc "Prebuild task setup"
task :prebuild => ["config", "lib/assets"] do
  FileUtils.cp_r '../config/.', 'config', :verbose => true
  FileUtils.cp_r '../conformance/tld_lib.yml', 'lib/assets', :verbose => true
end

require 'rubygems'
require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new(:spec)

namespace :test do
  namespace :conformance do
    desc "Run conformance test suite"
    task :run => ['prebuild'] do
      ruby "test/conformance_test.rb"
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:run'] do
  end
end

require 'rdoc/task'
namespace :doc do
  RDoc::Task.new do |rd|
    rd.main = "README.rdoc"
    rd.rdoc_dir = 'doc'
    rd.rdoc_files.include("README.rdoc", "lib/**/*.rb")
  end
end

desc "Run cruise control build"
task :cruise => [:spec, 'test:conformance'] do
end

desc "Clean build"
task :clean do
  rm_rf ["config", "pkg", "lib/assets", "Gemfile.lock"]
end
