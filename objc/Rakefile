task :default => ['test:conformance']
task :clean => ['test:clean']

def conformance_version(dir)
  require 'digest'
  Dir[File.join(dir, '*')].inject(Digest::SHA1.new){|digest, file| digest.update(Digest::SHA1.file(file).hexdigest) }
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
    task :latest => [:update] do
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

    desc "Convert testing data from YAML to JSON"
    task :convert_tests do
      system("cd test/ && ruby convert_tests.rb")
    end

    desc "Objective-C conformance test suite"
    task :run => [:convert_tests] do
      system("cd testproject/ && xcodebuild test -scheme TwitterTextTests")
    end
  end

  desc "Run conformance test suite"
  task :conformance => ['conformance:latest', 'conformance:run'] do
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
  tlds = YAML.load_file('test/twitter-text-conformance/tld_lib.yml')
  cctlds = format_tlds(tlds["country"])
  gtlds = format_tlds(tlds["generic"])
  twitter_text_m = File.read('lib/TwitterText.m')
  twitter_text_m = replace_tlds(twitter_text_m, 'TWUValidCCTLD', cctlds)
  twitter_text_m = replace_tlds(twitter_text_m, 'TWUValidGTLD', gtlds)
  File.open('lib/TwitterText.m', 'w') do |file|
    file.write twitter_text_m
  end
end
