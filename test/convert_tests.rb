#!/usr/bin/env ruby

$KCODE = 'u'

require 'yaml'
require 'rubygems'
require 'json'
require 'fileutils'

INPUT_PATH = 'twitter-text-conformance/'
OUTPUT_PATH = 'json-conformance/'

FILES = [
  'extract.yml',
  'validate.yml',
]

FILES.each do |filename|
  filename = INPUT_PATH + filename
  content = YAML.load(File.open(filename).read)
  s = JSON.pretty_generate(content)
  
  output_filename = File.basename(filename)
  output_filename.gsub!(/\.[a-zA-Z0-9]+$/, '');
  output_filename += '.json'
  
  FileUtils.mkdir_p(OUTPUT_PATH)
  
  File.open(OUTPUT_PATH + output_filename, 'w') do |f|
    f.truncate(0)
    f.write(s)
  end
end
