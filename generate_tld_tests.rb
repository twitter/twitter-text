#!/usr/bin/env ruby

# Generate the test file tlds.yml to ensure all tlds in tld_lib.yml are valid

require 'yaml'

test_yml = { 'tests' => { } }

path = File.join(File.dirname(__FILE__), 'tld_lib.yml')
yml = YAML.load_file(path)
yml.each do |type, tlds|
  test_yml['tests'][type] = []
  tlds.each do |tld|
    test_yml['tests'][type].push(
      'description' => "#{tld} is a valid #{type} tld",
      'text' => "https://twitter.#{tld}",
      'expected' => ["https://twitter.#{tld}"],
    )
  end
end

File.open('tlds.yml', 'w') do |file|
  file.write(test_yml.to_yaml)
end
