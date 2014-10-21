#!/usr/bin/env ruby

# Generates tld_lib.yml which can be reused in each twitter-text-library

require 'open-uri'
require 'nokogiri'
require 'yaml'

doc = Nokogiri::HTML(open('http://www.iana.org/domains/root/db'))
tlds = []
types = {
  'country' => /country-code/,
  'generic' => /generic|sponsored|infrastructure|generic-restricted/,
}
doc.css('table#tld-table tr').each do |tr|
  info = tr.css('td')
  next if info.empty?

  tlds << {
    domain: info[0].text.gsub('.', ''),
    type: info[1].text
  }
end

def select_tld(tlds, type)
  tlds.select {|i| i[:type] =~ type}.map {|i| i[:domain]}.sort
end

yml = {}
types.each do |name, regex|
  yml[name] = select_tld(tlds, regex)
end

File.open('tld_lib.yml', 'w') do |file|
  file.write(yml.to_yaml)
end
