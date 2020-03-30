# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [3.1.0] - 2020-03-26
### Changed
- Updates known gTLDs to recognize recent additions by IANA (#308)

## [3.0.0] - 2018-10-03
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

## [2.0.5] - 2018-02-07
### Changed
- Fixes project files to address analyzer warnings, problems with
  groups (and missing files)
- IFUnicodeURL.h is the umbrella header for the IFUnicodeURL.xcodeproj
  and as such, should not be included as a file in the
  TwitterText.xcodeproj
- Fixes project files to address problems using the framework on
  macOS.

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
