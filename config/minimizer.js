const TerserPlugin = require('terser-webpack-plugin');

const minimizer = new TerserPlugin({
  parallel: true,
  terserOptions: {
    // ecma: 8,
    warnings: false,
    mangle: true,
    output: {
      comments: false,
      beautify: false,
    },
    toplevel: true,
    nameCache: null,
    ie8: false,
    keep_classnames: true,
    keep_fnames: true,
    safari10: false,
    // unsafe: true, // new options
    // inline: true, // new options
    // passes: 2, // new options
    // keep_fargs: false, // new options
    compress: {
      // turn off flags with small gains to speed up minification
      arrows: false,
      collapse_vars: false, // 0.3kb
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,

      // a few flags with noticable gains/speed ratio
      // numbers based on out of the box vendor bundle
      booleans: true, // 0.7kb
      if_return: true, // 0.4kb
      sequences: true, // 0.7kb
      unused: true, // 2.3kb

      // required features to drop conditional branches
      conditionals: true,
      dead_code: true,
      evaluate: true
    },
  },
});

module.exports = {
  minimizer
}
