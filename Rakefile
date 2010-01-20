require 'rubygems' unless ENV['NO_RUBYGEMS']

desc "runs ant tests"
task :test do
  system('ant test') || raise("Build failed")
end

desc "runs cruise control build"
task :cruise => [:test] do
end
