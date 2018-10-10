import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import { argv } from 'optimist';
import resolve from 'rollup-plugin-node-resolve';

const banner = `/*!
 * <%= pkg.name %> <%= pkg.version %>
 *
 * Copyright 2018 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 */`;

const devPlugins = argv.prod
  ? []
  : [
      resolve({ preferBuiltins: false }),
      commonjs(),
      // Punycode is not transpiled, so we need to transpile again after commonjs modules are resolved
      babel({
        exclude: ['**/*.json'],
        plugins: ['external-helpers']
      })
    ];

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/twitter-text.js',
    format: 'umd',
    name: 'twttr.txt'
  },
  plugins: [
    babel({
      exclude: ['node_modules/**', '**/*.json'],
      plugins: ['external-helpers']
    }),
    // Resolve external deps only for development
    ...devPlugins,
    license({
      banner: banner
    })
  ]
};
