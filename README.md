
## Purpose

This conformance package provides a cross-platform definition of the test cases for auto linking, extracting and hit
highlighting of Tweets. The primary use for this is the twitter-text-* libraries; both those managed by Twitter and
those created by the community.

The reason for this conformance suite is to provide a way to keep the various implementations of Twitter text handling
working in a consistent and interoperable way. While anyone can feel free to implement this logic however they choose
the recommendation to developers is to use libraries which pass this conformance suite.

## Format

The test cases are stored in YAML files. There is one YAML file for each major operation type, and within those files
there is one section for each publicly accessible API. Each test case is defined by:

 * description: This provides a meaningful name for the test case, for use as an error message if a test fails.
 * text: The input text of the Tweet.
 * expected: What results are expected for this input text

## Guidelines for use

If you are creating a new twitter-text library in a different programming language please follow these few guidelines:

1. Create a test which reads these files and executes the test cases.
  1.a. Do not convert these files to test cases statically. These test cases will change over time.

2. Be sure to implement all of the publicly accessible APIs (the keys to the YAML file)

3. Only expose the public API method and not the underlying regular expressions
  3.a. If your language or environment does not allow for this please make a comment to the effect
  3.b. This prevents breakage when regular expressions need to change in fundamental ways

## Submitting new conformance tests

 * You can fork the github.com repository at https://github.com/twitter/twitter-text-conformance
   * Add your new tests and send a pull request.

 * You can open an issue on github.com at https://github.com/twitter/twitter-text-conformance/issues
   * Please be sure to provide example input and output as well as a brief description of the problem.

## Changelog

  * v1.4.0 - 2011-05-18 [ Git tag v1.4.0 ]
    * [FIX] Add support for Russian hashtags
    * [FIX] Add support for Korean hashtags
    * [FIX] Add support for Japanese hashtags (Katakana, Hiragana and Kanji)
    * [FIX] Add support for autolinking punycode domain names and TLDs (via punycode)
    * [DOC] Update README and License

  * v1.3.1 - 2010-12-03 - [ Git tag v1.3.1 ]
    * [DOC] Updated README with Changelog section
    * [FIX] Autolink URLs with paths ending in + and -
    * [FIX] Extract URLs with paths ending in + and -

  * v1.3.0 - 2010-12-03 - [ Git tag v1.3.0 ]
    * [NOTE] First tagged version (sorry)
    * [DOC] Updated README file with guidelines for use and format information
    * [FIX] Do not autolink URLs without protocols
    * [FIX] Do not extract URLs without protocols

  * v1.0.0 - 2010-01-21 - [ Git tag v1.0.0 (retroactively) ]
    * Initial version
    
## Copyright and License

     Copyright 2011 Twitter, Inc.
     
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this work except in compliance with the License.
     You may obtain a copy of the License in the LICENSE file, or at:
     
          http://www.apache.org/licenses/LICENSE-2.0
     
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
