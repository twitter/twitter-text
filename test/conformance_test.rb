require 'test/unit'
require 'yaml'
$KCODE = 'UTF8'
require File.dirname(__FILE__) + '/../lib/twitter-text'

class ConformanceTest < Test::Unit::TestCase
  include Twitter::Extractor
  include Twitter::Autolink
  include Twitter::HitHighlighter

  def setup
    @conformance_dir = ENV['CONFORMANCE_DIR'] || File.join(File.dirname(__FILE__), 'twitter-text-conformance')
  end

  module ExtractorConformance
    def test_replies_extractor_conformance
      run_conformance_test(File.join(@conformance_dir, 'extract.yml'), :replies) do |description, expected, input|
        assert_equal expected, extract_reply_screen_name(input), description
      end
    end

    def test_mentions_extractor_conformance
      run_conformance_test(File.join(@conformance_dir, 'extract.yml'), :mentions) do |description, expected, input|
        assert_equal expected, extract_mentioned_screen_names(input), description
      end
    end

    def test_url_extractor_conformance
      run_conformance_test(File.join(@conformance_dir, 'extract.yml'), :urls) do |description, expected, input|
        assert_equal expected, extract_urls(input), description
      end
    end

    def test_hashtag_extractor_conformance
      run_conformance_test(File.join(@conformance_dir, 'extract.yml'), :hashtags) do |description, expected, input|
        assert_equal expected, extract_hashtags(input), description
      end
    end

    def test_hashtags_with_indices_extractor_conformance
      run_conformance_test(File.join(@conformance_dir, 'extract.yml'), :hashtags_with_indices) do |description, expected, input|
        expected = expected.map{|elem| elem.symbolize_keys }
        assert_equal expected, extract_hashtags_with_indices(input), description
      end
    end
  end
  include ExtractorConformance

  module AutolinkConformance
    def test_users_autolink_conformance
      run_conformance_test(File.join(@conformance_dir, 'autolink.yml'), :usernames) do |description, expected, input|
        assert_equal expected, auto_link_usernames_or_lists(input, :suppress_no_follow => true), description
      end
    end

    def test_lists_autolink_conformance
      run_conformance_test(File.join(@conformance_dir, 'autolink.yml'), :lists) do |description, expected, input|
        assert_equal expected, auto_link_usernames_or_lists(input, :suppress_no_follow => true), description
      end
    end

    def test_urls_autolink_conformance
      run_conformance_test(File.join(@conformance_dir, 'autolink.yml'), :urls) do |description, expected, input|
        assert_equal expected, auto_link_urls_custom(input, :suppress_no_follow => true), description
      end
    end

    def test_hashtags_autolink_conformance
      run_conformance_test(File.join(@conformance_dir, 'autolink.yml'), :hashtags) do |description, expected, input|
        assert_equal expected, auto_link_hashtags(input, :suppress_no_follow => true), description
      end
    end

    def test_all_autolink_conformance
      run_conformance_test(File.join(@conformance_dir, 'autolink.yml'), :all) do |description, expected, input|
        assert_equal expected, auto_link(input, :suppress_no_follow => true), description
      end
    end
  end
  include AutolinkConformance

  module HitHighlighterConformance

    def test_plain_text_conformance
      run_conformance_test(File.join(@conformance_dir, 'hit_highlighting.yml'), :plain_text, true) do |config|
        assert_equal config['expected'], hit_highlight(config['text'], config['hits']), config['description']
      end
    end

    def test_with_links_conformance
      run_conformance_test(File.join(@conformance_dir, 'hit_highlighting.yml'), :with_links, true) do |config|
        assert_equal config['expected'], hit_highlight(config['text'], config['hits']), config['description']
      end
    end
  end
  include HitHighlighterConformance

  private

  def run_conformance_test(file, test_type, hash_config = false, &block)
    yaml = YAML.load_file(file)
    assert yaml["tests"][test_type.to_s], "No such test suite: #{test_type.to_s}"

    yaml["tests"][test_type.to_s].each do |test_info|
      if hash_config
        yield test_info
      else
        yield test_info['description'], test_info['expected'], test_info['text']
      end
    end
  end
end