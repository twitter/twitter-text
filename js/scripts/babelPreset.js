// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const process = require('process');

module.exports =
  process.env.BABEL_ENV === 'production'
    ? {
        presets: ['env'],
        plugins: [
          ['transform-object-rest-spread', { useBuiltIns: true }],
          [
            'transform-runtime',
            {
              polyfill: false
            }
          ],
          ['add-module-exports']
        ]
      }
    : {
        plugins: ['transform-object-rest-spread', 'external-helpers'],
        presets: [['env', { modules: false }]]
      };
