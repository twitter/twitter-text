# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [3.1.0]
### Changed
- Bump nokogiri version (#302)
- Fix auto-link emoji parsing (#304)
- Updates known gTLDs to recognize recent additions by IANA (#308)
- Fix warning about has_rdoc usage (#309)

## [3.0.0]
### Added
- New v3.json config file with emojiParsingEnabled config option. When
  true, twitter-text will parse and discount emoji supported by the
  twemoji library (see https://github.com/twitter/twemoji). The length
  of these emoji will be the default weight (200 or two characters) even
  if they contain multiple code points combined by zero-width
  joiners. This means that emoji with skin tone and gender modifiers no
  longer count as more characters than those without such modifiers.
### Changed
- Updates known gTLDs to recognize recent additions by IANA (#261)

## [2.1] - 2017-12-20
### Added
- This CHANGELOG.md file

### Changed
- Top-level namespace changed from `Twitter` to `Twitter::TwitterText`. This
  resolves a namespace collision with the popular
  [twitter gem](https://github.com/sferik/twitter). This is considered
  a breaking change, so the version has been bumped to 2.1. This fixes
  issue [#221](https://github.com/twitter/twitter-text/issues/221),
  "NoMethodError Exception: undefined method `[]' for nil:NilClasswhen
  using gem in rails app"

## [2.0.2] - 2017-12-18
### Changed
- Resolved issue
  [#211](https://github.com/twitter/twitter-text/issues/211), "gem
  breaks, asset file is a dangling symlink"
- config files, tld_lib.yml files now copied into the right place
- Rakefile now included `prebuild`, `clean` tasks
