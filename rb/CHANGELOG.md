# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

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
