# Changelog
All notable changes to this project will be documented in this file.

## [3.0.0] - 2018-10-10
### Added
- New v3.json config file with emojiParsingEnabled config option. When
  true, twitter-text will parse and discount emoji supported by the
  twemoji library (see https://github.com/twitter/twemoji-parser). The length
  of these emoji will be the default weight (200 or two characters) even
  if they contain multiple code points combined by zero-width
  joiners. This means that emoji with skin tone and gender modifiers no
  longer count as more characters than those without such modifiers.

### Changed
- Updates known gTLDs to recognize recent additions by IANA (#261)
- Parse t.co urls with query params as valid urls 