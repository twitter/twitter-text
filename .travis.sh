#!/usr/bin/env bash

case $TWITTER_TEXT_DIR in
  rb)
    cd rb
    gem update --system
    gem --version
    bundle
    rake
    ;;
  java)
    cd java
    git submodule update --init
    mvn test
    ;;
  js)
    cd js
    npm install -g grunt-cli
    npm install
    rake test:conformance:prepare
    grunt qunit && node test/node_tests.js
    ;;
esac
