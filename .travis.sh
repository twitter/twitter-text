#!/usr/bin/env bash

set -e

cd $TWITTER_TEXT_DIR

case $TWITTER_TEXT_DIR in
  rb)
    bundle
    bundle exec rake
    ;;
  java)
    mvn test
    ;;
  js)
    npm install -g grunt-cli
    npm install
    rake test:conformance:prepare
    grunt qunit && node test/node_tests.js
    ;;
  objc)
    rake
    ;;
esac
