# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.0.4] - 2018-01-26
### Changed
- Domains with country code TLDs that are not prefixed by a protocol
  will now be extracted as a URL entity. Previously .cc and .tv were
  special-cased. This may result in some tweets getting longer: a
  short domain like "twitter.co" will be counted as 23 characters.

## [2.0.3] - 2018-01-12
### Changed
- Made initWithConfiguration: public (Issue #236)
- Fixed config files in project file for cocoapod (Issue #235)
- renamed setDefaultParserConfiguration: to setDefaultParserWithConfiguration:

## [2.0.2] - 2018-01-11
### Changed
- Fixed deprecation warnings
- Final prep for cocoapod release of 2.0

## [2.0.1] - 2018-01-10
### Added
- This CHANGELOG.md file

### Changed
- Refactored use of IFUnicodeURL; removed embedded framework and added
  source files directly. This will unblock the release of the cocoapod.
- Cross-platform support for iOS and macOS (Issue #228)
- Rakefile now supports running both iOS and macOS conformance tests.
