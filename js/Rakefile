require 'rubygems'
require 'yaml'
require 'json'
require 'date'
require 'digest'

namespace :test do
  namespace :conformance do
    desc "Prepare JS conformance test suite"
    task :prepare do
      test_files = ['autolink', 'extract', 'hit_highlighting', 'validate', 'tlds']
      r = {}

      f = File.open(repo_path("test", "conformance.js"), "w")
      f.write("var cases = {};")

      test_files.each do |test_file|
        path = repo_path("..", "conformance", test_file + ".yml")
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
  task :conformance => ['conformance:prepare', 'conformance:run'] do
  end

  desc "Run JavaScript test suite"
  task :run do
    exec('open test/test.html')
  end

  desc "Run NodeJS test suite"
  task :node do
    exec('node test/node_tests.js');
  end
end

desc "Run JavaScript test suite"
task :test => ['test:run']

directory "pkg"

task :package, [:version] => [:pkg] do |t, args|
  pkg_name = "twitter-text-#{args.version}.js"
  puts "Building #{pkg_name}..."

  pkg_file = File.open(repo_path("pkg", pkg_name), "w")

  puts "Writing header..."
  header_comment = <<-COMMENT
/*!
 * twitter-text-js #{args.version}
 *
 * Copyright 2012 Twitter, Inc.
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
  js_file = File.open(repo_path("twitter-text.js"), "r")
  pkg_file.write(js_file.read)
  js_file.close

  pkg_file.close

  puts "Minify pkg..."
  src_file = repo_path("pkg", pkg_name)
  dst_file = repo_path("pkg", "twitter-text-#{args.version}.min.js")
  exec('node_modules/uglify-js/bin/uglifyjs ' + src_file + ' -o ' + dst_file);

  puts "Done with #{pkg_name}"

end

namespace :tlds do
  desc "Update tlds in twitter-text.js based on conformance tld_lib.yml"
  task :update do
    tld_yml = repo_path('..', 'conformance', 'tld_lib.yml')
    tlds = YAML.load_file(tld_yml)
    cctlds = format_tlds(tlds['country'], 100)
    gtlds = format_tlds(tlds['generic'], 100)

    twitter_text_js = File.read(repo_path('twitter-text.js'))
    replace_tlds!(twitter_text_js, 'validGTLD', gtlds)
    replace_tlds!(twitter_text_js, 'validCCTLD', cctlds)
    File.open(repo_path('twitter-text.js'), 'w') do |file|
      file.write(twitter_text_js)
    end
  end
end

def format_tlds(tlds, line_length)
  tld_line = []
  lines = []
  tlds.each do |tld|
    if line_js(tld_line + [tld]).length > line_length
      lines << line_js(tld_line)
      tld_line = [tld]
    else
      tld_line << tld
    end
  end
  lines << line_js(tld_line) if tld_line.length > 0
  lines.join("|' +\n") + "' +"
end

def line_js(tlds)
  quote = "'"
  indent = 4
  ' ' * indent + quote + tlds.join('|')
end

def replace_tlds!(source_code, name, tlds)
  start = Regexp.quote("twttr.txt.regexen.#{name} =")
  source_code.sub!(/#{start}.*?;\n/m, <<-D)
twttr.txt.regexen.#{name} = regexSupplant(RegExp(
    '(?:(?:' +
#{tlds}
    ')(?=[^0-9a-zA-Z@]|$))'));
D
end

def repo_path(*path)
  File.join(File.dirname(__FILE__), *path)
end
