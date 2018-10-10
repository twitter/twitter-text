// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    qunit: {
      all: ['test/test.html', 'test/conformance.html']
    }
  });
};
