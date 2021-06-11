'use strict';

module.exports = api => {
  return {
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-transform-spread',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      'add-module-exports'
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: api.env('commonjs') || api.env('test') ? 'commonjs' : false
        }
      ]
    ]
  };
};
