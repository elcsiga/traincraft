const path = require('path');
const base = require('./common/base.js');

module.exports = {
  ...base,
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
};