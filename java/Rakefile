require 'rubygems'
require 'yaml'
require 'json'
require 'date'

namespace :test do
  namespace :conformance do
    desc "Run conformance test suite"
    task :run do
      exec('mvn test')
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:run'] do
  end
end

desc "Run conformance test suite"
task :test => ['test:conformance']
