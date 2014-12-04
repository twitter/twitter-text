require 'yaml'
require 'rubygems'
require 'json'
require 'fileutils'

task :default => ['test:conformance:run']
task :clean => ['test:clean']

namespace :test do
  namespace :conformance do
    desc "Objective-C conformance test suite"
    task :run => [:convert_tests] do
      system("xctool test -scheme TwitterTextTests -project testproject/TwitterText.xcodeproj")
    end

    desc "Convert testing data from YAML to JSON"
    task :convert_tests do
      INPUT_PATH = repo_path('../conformance/')
      OUTPUT_PATH = repo_path('test/json-conformance/')

      FILES = [
        'extract.yml',
        'validate.yml',
        'tlds.yml',
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
    end
  end

  desc "Clean build and tests"
  task :clean do
    system("rm -rf testproject/build")
    system("rm -rf test/json-conformance")
  end
end

desc "Update TLDs"
task :update_tlds do
  require 'yaml'
  tlds = YAML.load_file(repo_path('../conformance/tld_lib.yml'))
  cctlds = format_tlds(tlds["country"])
  gtlds = format_tlds(tlds["generic"])
  twitter_text_m = File.read(repo_path('lib/TwitterText.m'))
  twitter_text_m = replace_tlds(twitter_text_m, 'TWUValidCCTLD', cctlds)
  twitter_text_m = replace_tlds(twitter_text_m, 'TWUValidGTLD', gtlds)
  File.open(repo_path('lib/TwitterText.m'), 'w') do |file|
    file.write twitter_text_m
  end
end

def repo_path(*path)
  File.join(File.dirname(__FILE__), *path)
end

def format_tlds(tlds, max_length = 100)
  tlds_group = tlds.each_with_object([[]]) do |tld, o|
    if (o.last + [tld]).join('|').size > max_length
      o << []
    end
    o.last << tld
  end
  tlds_group.map do |tlds|
    "    @\"" + tlds.join('|') + "|\" \\\n"
  end.join('').sub(/\|[^|]*\Z/) {|m| m[1..-1]}.sub(/\n\Z/, '')
end

def replace_tlds(source_code, name, tlds)
  source_code.sub(/#{Regexp.quote('#define ' + name)}.*?#{Regexp.quote('@")"')}\n/m, <<-D)
#define #{name} \\
@"(?:" \\
#{tlds}
@")"
  D
end
