require 'rubygems'
require 'yaml'
require 'json'
require 'date'
require 'digest'

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

    desc "Prepare JS conformance test suite"
    task :prepare do
      test_files = ['autolink', 'extract', 'hit_highlighting', 'validate']
      r = {}

      f = File.open(File.join(File.dirname(__FILE__), "test", "conformance.js"), "w")
      f.write("var cases = {};")

      test_files.each do |test_file|
        path = File.join(File.dirname(__FILE__), "test", "twitter-text-conformance", test_file + ".yml")
        yml = YAML.load_file(path)
        f.write("cases.#{test_file} = #{yml['tests'].to_json};")
      end

      f.close
    end

    desc "Run conformance test suite"
    task :run do
      exec('open test/conformance.html')
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:latest', 'conformance:prepare', 'conformance:run'] do
  end

  desc "Run JavaScript test suite"
  task :run do
    exec('open test/test.html')
  end
end

desc "Run JavaScript test suite"
task :test => ['test:run']

directory "pkg"

task :package, [:version] => [:pkg] do |t, args|
  pkg_name = "twitter-text-#{args.version}.js"
  puts "Building #{pkg_name}..."

  pkg_file = File.open(File.join(File.dirname(__FILE__), "pkg", pkg_name), "w")

  puts "Writing header..."
  header_comment = <<-COMMENT
/*!
 * twitter-text-js #{args.version}
 *
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 */
  COMMENT
  pkg_file.write(header_comment)

  puts "Writing library..."
  js_file = File.open(File.join(File.dirname(__FILE__), "twitter-text.js"), "r")
  pkg_file.write(js_file.read)
  js_file.close

  pkg_file.close

  puts "Done with #{pkg_name}"

end