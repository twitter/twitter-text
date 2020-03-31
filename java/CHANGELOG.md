# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [3.1.0] - 2020-27-03
### Removed
- Stopped reading data files (JSON) for configuration in order to remove
  heavyweight dependency on Jackson.
- Defaulted configuraiton to the values in the v3.json files still used
  by the other language implementations.
- Removed proguard configuration since it was about protecting data files
  from obfuscation.

### Added
- [emoji] Recognize new gender-neutral sequences from 12.1

### Changed
- Updates known gTLDs to recognize recent additions by IANA

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
